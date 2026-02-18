import { useState } from "react";
import { Calendar } from "lucide-react";

type Status = "TODO" | "IN_PROGRESS" | "DONE";

type ModalCreerTacheProps = {
    members?: { id: string; name: string }[];
    onSubmit: (data: {
        title: string;
        description: string;
        dueDate: string;
        assignees: string[];
        status: Status;
    }) => void;
};

export default function ModalCreateTask({ onSubmit, members = [] }: ModalCreerTacheProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [assignees, setAssignees] = useState<string[]>([]);
    const [status, setStatus] = useState<Status>("TODO");

    const handleSubmit = () => {
        onSubmit({
            title,
            description,
            dueDate,
            assignees,
            status,
        });
    };

    return (
        <div className="flex flex-col gap-6 w-full md:w-[598px] ">
            {/* Titre */}
            <h2 className="text-xl font-semibold text-gray-900">
                Créer une tâche
            </h2>

            {/* Titre */}
            <div>
                <label className="text-sm font-medium text-gray-700">
                    Titre*
                </label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
            </div>

            {/* Description */}
            <div>
                <label className="text-sm font-medium text-gray-700">
                    Description*
                </label>
                <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
            </div>

            {/* Échéance */}
            <div>
                <label className="text-sm font-medium text-gray-700">
                    Échéance*
                </label>
                <div className="relative mt-1">
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                    <Calendar
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                </div>
            </div>

            {/* Assignés */}
            <div>
                <label className="text-sm font-medium text-gray-700">
                    Assigné à :
                </label>

                {/* Liste des assignés sélectionnés */}
                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                    {assignees.map(id => {
                        const member = members.find(m => m.id === id);
                        return member ? (
                            <span
                                key={id}
                                onClick={() => setAssignees(prev => prev.filter(mid => mid !== id))}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium cursor-pointer hover:bg-orange-200 transition-colors"
                            >
                                {member.name}
                                <span className="text-orange-900 font-bold ml-1">×</span>
                            </span>
                        ) : null;
                    })}
                </div>

                {/* Sélecteur pour ajouter */}
                <select
                    className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-100 bg-white"
                    value="" // Toujours reset à vide pour permettre de resélectionner
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val && !assignees.includes(val)) {
                            setAssignees(prev => [...prev, val]);
                        }
                    }}
                >
                    <option value="">+ Ajouter un collaborateur</option>
                    {members
                        .filter(m => !assignees.includes(m.id)) // Masquer ceux déjà sélectionnés
                        .map((member, idx) => (
                            <option key={`${member.id}-${idx}`} value={member.id}>
                                {member.name}
                            </option>
                        ))}
                </select>
            </div>

            {/* Statut */}
            <div>
                <label className="text-sm font-medium text-gray-700">
                    Statut :
                </label>
                <div className="mt-2 flex gap-2">
                    <button
                        type="button"
                        onClick={() => setStatus("TODO")}
                        className={`rounded-full px-3 py-1 text-sm ${status === "TODO"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-500"
                            }`}
                    >
                        À faire
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatus("IN_PROGRESS")}
                        className={`rounded-full px-3 py-1 text-sm ${status === "IN_PROGRESS"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-gray-100 text-gray-500"
                            }`}
                    >
                        En cours
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatus("DONE")}
                        className={`rounded-full px-3 py-1 text-sm ${status === "DONE"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-500"
                            }`}
                    >
                        Terminée
                    </button>
                </div>
            </div>

            <button
                type="button"
                onClick={handleSubmit}
                disabled={!title || !description}
                className={`mt-4 w-fit rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${title && description
                    ? "bg-orange-500 text-white cursor-pointer hover:bg-orange-600"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
            >
                + Ajouter une tâche
            </button>
        </div>
    );
}
