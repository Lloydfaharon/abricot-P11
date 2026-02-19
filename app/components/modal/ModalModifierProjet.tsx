import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '@/app/context/DataContext';
import { ProjectData } from '@/app/services/project';
import { ChevronDown } from 'lucide-react';
import ConfirmModal from '../ui/ConfirmModal';

interface ModalModifierProjetProps {
    project: ProjectData;
    onClose?: () => void;
}

export default function ModalModifierProjet({ project, onClose }: ModalModifierProjetProps) {
    const { projects, updateProject, deleteProject } = useData();
    const [title, setTitle] = useState(project?.title || "");
    const [description, setDescription] = useState(project?.description || "");

    // Initialisation des membres
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

    // Mise à jour de l'état local
    useEffect(() => {
        if (project) {
            setTitle(project.title);
            setDescription(project.description);
            // Exclusion du propriétaire
            const currentMemberIds = project.team
                .filter(m => m.role !== 'Propriétaire' && m.id !== 'owner')
                .map(m => m.id);
            setSelectedMemberIds(currentMemberIds);
        }
    }, [project]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Récupération des utilisateurs uniques
    const availableMembers = useMemo(() => {
        const unique = new Map();
        projects.forEach(p => {
            p.team.forEach(m => {
                if (m.id && m.name && !unique.has(m.id) && m.id !== 'unknown' && m.id !== 'owner') {
                    unique.set(m.id, { id: m.id, name: m.name, email: m.email });
                }
            });
        });
        return Array.from(unique.values()) as { id: string; name: string; email?: string }[];
    }, [projects]);

    const handleSubmit = async () => {
        if (!title || !description) return;

        // Préparation des contributeurs
        const contributors = selectedMemberIds
            .map(id => availableMembers.find(m => m.id === id)?.email)
            .filter((email): email is string => !!email);

        setIsSubmitting(true);
        try {
            await updateProject(project.id, {
                name: title, // Backend expects 'name'
                description,
                contributors
            });
            if (onClose) onClose();
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la modification du projet");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col w-full md:w-[598px] gap-6 pt-2 relative">

            {/* Titre Input */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Titre*</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-100 placeholder:text-gray-300"
                />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Description*</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-100 placeholder:text-gray-300"
                />
            </div>

            {/* Contributeurs */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Contributeurs</label>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-2 empty:hidden">
                    {selectedMemberIds.map(id => {
                        const member = availableMembers.find(m => m.id === id);
                        // Fallback si le membre n'est pas dans availableMembers
                        const projectMember = project.team.find(m => m.id === id);
                        const name = member?.name || projectMember?.name || "Inconnu";

                        return (
                            <span
                                key={id}
                                role="button"
                                tabIndex={0}
                                onClick={() => setSelectedMemberIds(prev => prev.filter(mid => mid !== id))}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setSelectedMemberIds(prev => prev.filter(mid => mid !== id));
                                    }
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium cursor-pointer hover:bg-orange-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300"
                            >
                                {name}
                                <span className="text-orange-900 font-bold ml-1">×</span>
                            </span>
                        );
                    })}
                </div>

                <div className="relative">
                    <select
                        className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm text-gray-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-100 bg-white appearance-none"
                        value=""
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val && !selectedMemberIds.includes(val)) {
                                setSelectedMemberIds(prev => [...prev, val]);
                            }
                        }}
                    >
                        <option value="">Choisir un ou plusieurs collaborateurs</option>
                        {availableMembers
                            .filter(m => !selectedMemberIds.includes(m.id))
                            .map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.name}
                                </option>
                            ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
                </div>
            </div>

            {/* Bouton Enregistrer & Supprimer */}
            <div className="pt-8 flex justify-between items-center">
                <button
                    onClick={handleSubmit}
                    disabled={!title || !description || isSubmitting}
                    className={`px-6 py-3 rounded-md text-sm font-semibold transition-colors ${title && description && !isSubmitting
                        ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                >
                    {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                </button>

                {/* Zone de danger : Suppression */}
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                >
                    Supprimer le projet
                </button>
            </div>

            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Supprimer ce projet ?"
                description="Cette action est irréversible. Toutes les tâches et les données associées seront perdues définitivement."
                confirmText="Confirmer la suppression"
                onConfirm={() => {
                    deleteProject(project.id);
                    if (onClose) onClose();
                    window.location.href = "/projet";
                }}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div>
    );
}