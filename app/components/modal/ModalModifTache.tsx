import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

interface ModalModifyTaskProps {
    initialTitle: string;
    initialDescription: string;
    initialDueDate: string;
    initialStatus: string;
    initialAssignees: string[]; // List of IDs
    members: { id: string; name: string }[];
    onSave: (data: any) => void;
    onClose: () => void;
    initialAssigneesCount?: number; // kept for compatibility if needed, but unused
    className?: string;
}

export default function ModalModifyTask({
    initialTitle,
    initialDescription,
    initialDueDate,
    initialStatus = "TODO",
    initialAssignees = [],
    members = [],
    onSave,
    onClose,
    className = ""
}: ModalModifyTaskProps) {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    // Ensure format YYYY-MM-DD for input type="date"
    const formatDateForInput = (dateStr: string) => {
        if (!dateStr || dateStr === "-") return "";
        try {
            // Try to parse if it's ISO or Date
            const d = new Date(dateStr);
            if (!isNaN(d.getTime())) {
                return d.toISOString().split('T')[0];
            }
        } catch { }
        return "";
    };

    const [dueDate, setDueDate] = useState(formatDateForInput(initialDueDate));
    const [status, setStatus] = useState(initialStatus);
    const [assignees, setAssignees] = useState<string[]>(initialAssignees);

    const handleSave = () => {
        onSave({
            title,
            description,
            dueDate, // This will be YYYY-MM-DD string
            assignees, // Array of IDs
            status
        });
        onClose();
    };

    return (
        <div className={`flex flex-col gap-6 pt-4 w-full md:w-[560px] ${className}`}>
            {/* Titre */}
            <div className="space-y-2 ">
                <label className="text-sm font-medium text-gray-900">Titre</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Description</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
            </div>

            {/* Échéance */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Échéance</label>
                <div className="relative">
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                    <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
                </div>
            </div>

            {/* Assigné à */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Assigné à :</label>

                {/* Liste des assignés sélectionnés tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                    {assignees.map(id => {
                        const member = members.find(m => m.id === id);
                        if (!member) return null;
                        return (
                            <span
                                key={id}
                                role="button"
                                tabIndex={0}
                                onClick={() => setAssignees(prev => prev.filter(mid => mid !== id))}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setAssignees(prev => prev.filter(mid => mid !== id));
                                    }
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium cursor-pointer hover:bg-orange-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300"
                            >
                                {member.name}
                                <span className="text-orange-900 font-bold ml-1">×</span>
                            </span>
                        );
                    })}
                </div>

                {/* Sélecteur dropdown */}
                <select
                    className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm text-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-100 bg-white"
                    value=""
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val && !assignees.includes(val)) {
                            setAssignees(prev => [...prev, val]);
                        }
                    }}
                >
                    <option value="">+ Ajouter un collaborateur</option>
                    {members
                        .filter(m => !assignees.includes(m.id))
                        .map((member, idx) => (
                            <option key={`${member.id}-${idx}`} value={member.id}>
                                {member.name}
                            </option>
                        ))}
                </select>
            </div>

            {/* Statut */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Statut :</label>
                <div className="flex gap-2">
                    <button
                        onClick={() => setStatus("TODO")}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${status === "TODO" ? "bg-red-100 text-red-600" : "bg-red-50 text-red-400 hover:bg-red-100"}`}
                    >
                        À faire
                    </button>
                    <button
                        onClick={() => setStatus("IN_PROGRESS")}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${status === "IN_PROGRESS" ? "bg-orange-100 text-orange-600" : "bg-orange-50 text-orange-400 hover:bg-orange-100"}`}
                    >
                        En cours
                    </button>
                    <button
                        onClick={() => setStatus("DONE")}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${status === "DONE" ? "bg-green-100 text-green-600" : "bg-green-50 text-green-400 hover:bg-green-100"}`}
                    >
                        Terminée
                    </button>
                </div>
            </div>

            {/* Bouton Enregistrer */}
            <div className="pt-4">
                <button
                    onClick={handleSave}
                    className="w-[180px] h-10 bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-700 rounded-md text-sm font-medium transition-colors"
                >
                    Enregistrer
                </button>
            </div>
        </div>
    );
}