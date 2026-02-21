import React, { useState, useEffect, useRef } from 'react';
import { MoreHorizontal, Calendar, ChevronUp, Trash2, Pencil } from 'lucide-react';
import Comment from '../comment/Comment';
import { taskService } from '@/app/services/task';
import { useData } from '@/app/context/DataContext';
import Modal from '../modal/Modal';
import ModalModifTache from '../modal/ModalModifTache';

interface Assignee {
    name: string;
    initials: string;
}

interface TacheListeCardProps {
    id: string; // ID required for API calls
    projectId: string; // Project ID required for API calls
    title: string;
    status?: string; // "À faire", "En cours", etc.
    description: string;
    dueDate?: string;
    assignees?: Assignee[];
    commentCount?: number;
    priority?: string;
    comments?: {
        id: string;
        content: string;
        author: { name: string };
        createdAt: string;
    }[];
    members?: { id: string; name: string }[];
    isoDueDate?: string;
    onUpdate?: () => void;
}

const mapStatus = (status: string): "À faire" | "En cours" | "Terminé" => {
    switch (status) {
        case "TODO": return "À faire";
        case "IN_PROGRESS": return "En cours";
        case "DONE": return "Terminé";
        default: return "À faire";
    }
};

const getStatusColor = (status: string): string => {
    switch (status) {
        case "TODO": return "bg-red-50 text-red-500";
        case "IN_PROGRESS": return "bg-orange-50 text-orange-600";
        case "DONE": return "bg-green-50 text-green-600";
        default: return "bg-gray-50 text-gray-500";
    }
};

export default function TacheListeCard({
    id,
    projectId,
    title = "Authentification JWT",
    status = "À faire",
    description = "Implémenter le système d'authentification avec tokens JWT",
    dueDate = "9 mars",
    assignees = [
        { name: "Bertrand Dupont", initials: "BD" },
        { name: "Anne Dupont", initials: "AD" }
    ],
    commentCount = 1,
    comments = [], // Prop for actual comments data
    members = [],
    isoDueDate,
    onUpdate

}: TacheListeCardProps) {
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // On garde l'état d'ouverture du menu pour gérer la vue "confirmation" dedans
    const [menuMode, setMenuMode] = useState<'default' | 'confirm_delete'>('default');
    const menuRef = useRef<HTMLDivElement>(null);

    // État local pour les commentaires (affichage immédiat)
    const [localComments, setLocalComments] = useState(comments || []);

    const { refreshData, user, deleteTask } = useData();

    // Gestion du clic à l'extérieur pour fermer le menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
                setMenuMode('default'); // On reset si on ferme
            }
        };

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    // Synchro si les props changent (ex: refresh global terminé)
    useEffect(() => {
        if (comments) {
            setLocalComments(comments);
        }
    }, [comments]);

    const getUserInitials = (name: string) => {
        if (!name) return "";
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const userInitials = user?.name ? getUserInitials(user.name) : "MOI";

    const handleDeleteTask = async () => {
        try {
            await deleteTask(projectId, id);
            setIsMenuOpen(false);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Erreur suppression:", error);
            alert("Impossible de supprimer la tâche.");
        }
    };

    const handleUpdateTask = async (updatedData: any) => {
        try {
            const payload = {
                title: updatedData.title,
                description: updatedData.description,
                status: updatedData.status,
                // Ensure date is valid before conversion
                dueDate: updatedData.dueDate ? new Date(updatedData.dueDate).toISOString() : null,
                assigneeIds: updatedData.assignees || []
            };

            await taskService.updateTask(projectId, id, payload);

            setIsModalOpen(false);
            // Refresh global data to update UI
            refreshData();
            if (onUpdate) onUpdate();
        } catch (error: any) {
            console.error("Erreur mise à jour:", error);
            alert(`Erreur lors de la mise à jour de la tâche : ${error.message || "Erreur inconnue"}`);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            await taskService.addComment(projectId, id, newComment);

            // Optimistic update : Ajout immédiat à la liste locale
            const addedComment = {
                id: `temp-${Date.now()}`,
                content: newComment,
                author: { name: user?.name || "Moi" },
                createdAt: new Date().toISOString()
            };

            setLocalComments(prev => [...prev, addedComment]);
            setNewComment("");

            // Le refresh global se fera en fond
            // refreshData();
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'ajout du commentaire");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            role="article"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target === e.currentTarget) {
                    setIsModalOpen(true);
                }
            }}
            className="w-full bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-orange-200"
        >
            {/* Header: Title + Badge + Menu */}
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-gray-900">{title}</h3>
                    <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(status)}`}>
                        {mapStatus(status)}
                    </span>
                </div>
                <div className="relative" ref={menuRef}>
                    <button aria-label="Menu" onClick={() => {
                        setIsMenuOpen(!isMenuOpen);
                        setMenuMode('default');
                    }} className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 bg-white">
                        <MoreHorizontal size={16} />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 top-10 w-100 px-10 py-8 bg-white border border-gray-200 rounded-lg shadow-lg z-50 sm:w-150">
                            {menuMode === 'default' ? (
                                <div className="flex flex-col ">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
                                    <p className="text-sm text-gray-500 mb-8">{description}</p>
                                    <div className="flex items-center gap-3 text-sm font-medium">
                                        <button
                                            onClick={() => setMenuMode('confirm_delete')}
                                            className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                            Supprimer
                                        </button>
                                        <span className="text-gray-200 text-lg font-light">|</span>
                                        <button onClick={() => {
                                            setIsMenuOpen(false);
                                            setIsModalOpen(true);
                                        }} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                                            <Pencil size={16} />
                                            Modifier
                                        </button>

                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
                                    <div className="bg-red-50 p-3 rounded-full mb-3 text-red-600">
                                        <Trash2 size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Supprimer cette tâche ?</h3>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Cette action est irréversible.
                                    </p>
                                    <div className="flex gap-3 w-full justify-center">
                                        <button
                                            onClick={() => setMenuMode('default')}
                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={handleDeleteTask}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-200"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 mb-6">
                {description}
            </p>

            {/* Meta Info */}
            <div className="space-y-4 mb-6">
                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-gray-400 w-20 text-xs">Échéance :</span>
                    <div className="flex items-center gap-1.5 font-medium">
                        <Calendar size={14} className="text-gray-500" />
                        <span>{dueDate}</span>
                    </div>
                </div>

                {/* Assignees */}
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 w-20 text-xs shrink-0">Assigné à :</span>
                    <div className="flex flex-wrap gap-2">
                        {assignees?.map((assignee, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                {/* Pill Style */}
                                <div className="flex items-center gap-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-600 text-[11px] font-bold">
                                        {assignee.initials}
                                    </span>
                                    <div className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-medium">
                                        {assignee.name}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer: Comments separator */}
            <div
                role="button"
                tabIndex={0}
                onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsCommentsOpen(!isCommentsOpen);
                    }
                }}
                className=" border-t border-gray-100 pt-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 -mx-6 -mb-2 pb-2 mt-2 transition-colors group focus:outline-none focus:bg-gray-50 px-6 rounded-b-xl"
            >
                <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    Commentaires ({commentCount})
                </span>
                <ChevronUp
                    size={16}
                    className={`text-gray-400 group-hover:text-gray-600 transition-transform ${isCommentsOpen ? 'rotate-180' : ''}`}
                />
            </div>

            {/* Comments Section */}
            {
                isCommentsOpen && (
                    <div className="mt-4 pt-2 border-t border-gray-50 space-y-1">
                        {localComments && localComments.length > 0 ? (
                            localComments.map((comment, idx) => (
                                <Comment
                                    key={comment.id || idx}
                                    content={comment.content}
                                    authorName={comment.author?.name || "Anonyme"}
                                    createdAt={comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "-"}
                                />
                            ))
                        ) : (
                            <p className="text-xs text-center text-gray-400 py-2">Aucun commentaire</p>
                        )}
                        <div>

                            <div className="flex gap-3 p-3 hover: rounded-lg transition-colors">
                                {/* Avatar Placeholder */}
                                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-gray-500">
                                    {userInitials}
                                </div>

                                {/* Content */}
                                <div className="flex flex-col gap-2 h-full py-3.5 px-3.5 w-full rounded-lg bg-gray-50">
                                    <input
                                        aria-label="Ajouter un commentaire"
                                        type="text"
                                        placeholder="Ajouter un commentaire..."
                                        className="bg-transparent text-sm outline-none w-full h-14 placeholder-gray-400 text-gray-700"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                        disabled={submitting}
                                    />
                                </div>

                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={handleAddComment}
                                    disabled={!newComment.trim() || submitting}
                                    className="text-xs bg-gray-300 text-gray-600 w-52 h-12 mx-3.5 px-3 py-1.5 rounded-md font-medium hover:bg-gray-400 disabled:opacity-50 transition-colors"
                                >
                                    {submitting ? 'Envoi...' : 'Envoyer'}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Modifier la tâche"
            >
                <ModalModifTache
                    initialTitle={title}
                    initialDescription={description}
                    initialDueDate={isoDueDate || ""}
                    initialStatus={status === "En cours" ? "IN_PROGRESS" : status === "Terminé" ? "DONE" : "TODO"}
                    initialAssigneesCount={assignees?.length || 0}
                    // We try to map names back to IDs if ID is missing in assignee object
                    initialAssignees={assignees?.map(a => {
                        // @ts-expect-error
                        if (a.id) return a.id;
                        const found = members.find(m => m.name === a.name);
                        return found ? found.id : null;
                    }).filter(Boolean) as string[] || []}
                    members={members}
                    onSave={handleUpdateTask}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div >
    );
}
