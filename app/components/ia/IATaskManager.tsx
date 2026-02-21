'use client'
import { useState } from 'react';
import { Trash2, Pencil, Plus, Loader2 } from 'lucide-react';
import { useData } from '@/app/context/DataContext';
import ModalModifyTask from '../modal/ModalModifTache';
import { AssignedTask } from '@/app/services/task';

interface Props {
    projectId: string;
    members?: { id: string; name: string }[];
    onClose?: () => void;
    onSuccess?: () => void;
    existingTasks?: AssignedTask[];
}

export default function IATaskManager({ projectId, onClose, members = [], onSuccess, existingTasks = [] }: Props) {
    const { createTask } = useData();
    const [step, setStep] = useState(1);
    const [prompt, setPrompt] = useState("");
    const [tasks, setTasks] = useState<{
        name: string;
        description: string;
        status?: string;
        dueDate?: string;
        assignees?: string[]
    }[]>([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    demandeUtilisateur: prompt,
                    tachesExistantes: existingTasks.map(t => ({ title: t.title, status: t.status }))
                }),
            });

            if (!res.ok) throw new Error("Erreur lors de la génération");

            const data = await res.json();

            // Sécurisation du format de réponse
            const taskList = Array.isArray(data) ? data : (data.tasks || []);

            setTasks(taskList);
            setStep(2);
        } catch (err) {
            console.error(err);
            alert("Une erreur est survenue lors de la génération des tâches.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAll = async () => {
        if (tasks.length === 0) return;
        setSaving(true);
        try {
            // On crée les tâches une par une
            for (const task of tasks) {
                await createTask(projectId, {
                    title: task.name,
                    description: task.description,
                    status: (task.status as any) || "TODO",
                    priority: "MEDIUM",
                    dueDate: task.dueDate,
                    assignees: task.assignees || []
                });
            }
            // Tout est bon, on ferme
            if (onSuccess) onSuccess();
            if (onClose) onClose();
        } catch (error) {
            console.error("Erreur sauvegarde IA:", error);
            alert("Erreur lors de la création des tâches.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteGeneratedTask = (index: number) => {
        const newTasks = [...tasks];
        newTasks.splice(index, 1);
        setTasks(newTasks);
        if (editingIndex === index) setEditingIndex(null);
        if (newTasks.length === 0) setStep(1);
    };

    const handleUpdateTask = (index: number, updatedData: any) => {
        const newTasks = [...tasks];
        // ModalModifyTask returns { title, description, dueDate, assignees, status }
        // We map it back to our local format
        newTasks[index] = {
            ...newTasks[index],
            name: updatedData.title,
            description: updatedData.description,
            dueDate: updatedData.dueDate,
            assignees: updatedData.assignees,
            status: updatedData.status
        };
        setTasks(newTasks);
        setEditingIndex(null);
    };

    return (
        <div className="flex flex-col h-150 w-full md:w-150 px-2 relative font-sans">
            {/* TITRE DYNAMIQUE */}
            <div className={`flex items-center gap-3 text-2xl font-semibold text-gray-900 mb-8 shrink-0 ${editingIndex !== null ? 'opacity-50 pointer-events-none' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                    <path d="M8.24333 0.574802C8.60336 -0.19163 9.69352 -0.19163 10.0535 0.574802L12.351 5.46554C12.4501 5.67658 12.6199 5.84634 12.8309 5.94548L17.7216 8.2429C18.4881 8.60293 18.4881 9.69309 17.7216 10.0531L12.8309 12.3505C12.6199 12.4497 12.4501 12.6194 12.351 12.8305L10.0535 17.7212C9.69352 18.4876 8.60336 18.4876 8.24333 17.7212L5.9459 12.8305C5.84677 12.6194 5.677 12.4497 5.46597 12.3505L0.575229 10.0531C-0.191203 9.69309 -0.191203 8.60293 0.575229 8.2429L5.46597 5.94547C5.677 5.84634 5.84677 5.67658 5.9459 5.46554L8.24333 0.574802Z" fill="#FF8B42" />
                </svg>
                {step === 1 ? "Créer une tâche" : "Vos tâches..."}
            </div>

            {/* CONTENU PRINCIPAL */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-24">
                {step === 1 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-4 opacity-40">
                        {/* Empty state visual */}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {tasks.map((task, index) => {
                            if (editingIndex === index) {
                                return (
                                    <div key={index} className="border border-orange-200 rounded-xl w-full  p-4 bg-orange-50/10 shadow-md">
                                        <h4 className="font-bold text-orange-600 text-sm mb-2">Modification de la tâche</h4>
                                        <ModalModifyTask
                                            members={members}
                                            initialTitle={task.name}
                                            initialDescription={task.description}
                                            initialDueDate={task.dueDate || ""}
                                            initialStatus={task.status || "TODO"}
                                            initialAssignees={task.assignees || []}
                                            onSave={(data) => handleUpdateTask(index, data)}
                                            onClose={() => setEditingIndex(null)}
                                            // Override width to fit container
                                            className="w-full pt-0!"
                                        />
                                    </div>
                                );
                            }


                            return (
                                <div key={index} className="border border-gray-100 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-white hover:shadow-md hover:border-gray-200 transition-all group relative">
                                    <h4 className="font-bold text-gray-900 text-base mb-1.5 pr-8">{task.name}</h4>
                                    <p className="text-gray-500 text-sm mb-5 leading-relaxed font-normal">{task.description}</p>

                                    {/* Badges d'infos si présents */}
                                    {(task.assignees?.length || task.dueDate) ? (
                                        <div className="flex gap-2 mb-4">
                                            {task.dueDate && (
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                    📅 {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                            )}
                                            {task.assignees && task.assignees.length > 0 && (
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                    👤 {task.assignees.length} assigné(s)
                                                </span>
                                            )}
                                        </div>
                                    ) : null}

                                    <div className="flex items-center gap-3 text-xs font-medium text-gray-500 border-t border-gray-100 pt-4">
                                        <button
                                            onClick={() => handleDeleteGeneratedTask(index)}
                                            className="flex items-center gap-1.5 hover:text-red-500 transition-colors group"
                                        >
                                            <Trash2 size={14} className="text-gray-400 group-hover:text-red-500" /> Supprimer
                                        </button>
                                        <span className="text-gray-200 text-lg font-light">|</span>
                                        <button
                                            onClick={() => setEditingIndex(index)}
                                            className="flex items-center gap-1.5 hover:text-gray-800 transition-colors group"
                                        >
                                            <Pencil size={14} className="text-gray-400 group-hover:text-gray-800" /> Modifier
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Hide main buttons if editing? No, allow cancelling edit by clicking elsewhere logic handled by local onClose */}
                        {editingIndex === null && (
                            <div className="flex justify-center pt-6 pb-4">
                                <button
                                    onClick={handleSaveAll}
                                    disabled={saving}
                                    className="bg-[#1A1A1A] hover:bg-black text-white px-8 py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} /> Création...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={18} strokeWidth={2.5} /> Ajouter les tâches
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* BARRE DE SAISIE (Sticky Bottom) */}
            {editingIndex === null && (
                <div className="absolute bottom-0 left-0 right-0 bg-white pt-4 pb-2 z-20 px-2">
                    <div className="relative">
                        <input
                            aria-label="Décrivez les tâches que vous souhaitez ajouter"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Décrivez les tâches que vous souhaitez ajouter..."
                            className="w-full bg-[#F9FAFB] hover:bg-gray-50 focus:bg-white border border-transparent focus:border-gray-100 text-gray-800 placeholder-gray-400 text-sm py-4 pl-6 pr-16 rounded-3xl outline-none transition-all"
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            autoFocus={step === 1}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !prompt.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#E85D04] hover:bg-[#ff6a0a] text-white w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-90 shadow-sm"
                        >
                            {loading ? <Loader2 className="animate-spin text-white" size={20} /> : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 8 8" fill="none">
                                <path d="M3.29694 0.229931C3.44095 -0.0766419 3.87702 -0.0766428 4.02103 0.22993L4.94 2.18623C4.97965 2.27064 5.04756 2.33855 5.13197 2.3782L7.08827 3.29717C7.39484 3.44118 7.39484 3.87725 7.08827 4.02126L5.13197 4.94023C5.04756 4.97988 4.97965 5.04779 4.94 5.1322L4.02103 7.0885C3.87702 7.39507 3.44095 7.39507 3.29694 7.0885L2.37797 5.1322C2.33832 5.04779 2.27041 4.97988 2.186 4.94023L0.229702 4.02126C-0.0768707 3.87725 -0.0768717 3.44118 0.229701 3.29717L2.186 2.3782C2.27041 2.33855 2.33832 2.27064 2.37797 2.18623L3.29694 0.229931Z" fill="white" />
                            </svg>}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}