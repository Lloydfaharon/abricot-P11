'use client';

import Image from "next/image";
import { useState } from "react";
import TaskCard from "../taskcard/TaskCard";
import TaskCardCompact from "../taskcard/TaskCardCompact";
import { useData } from "@/app/context/DataContext";
import { Search } from "lucide-react";


export default function InterfacesTdB() {
    const { tasks, loading } = useData();
    const [view, setView] = useState<'LIST' | 'KANBAN'>('LIST');
    const [searchQuery, setSearchQuery] = useState("");


    // On n'utilise plus pathname pour l'actif, mais le state 'view'
    const isViewActive = (currentView: 'LIST' | 'KANBAN') => view === currentView;

    const getLinkClass = (targetView: 'LIST' | 'KANBAN') => {
        const active = isViewActive(targetView);
        // Base identique, on garde vos styles
        const base = "flex items-center justify-center gap-3 px-6 py-3 rounded-[10px] transition-all font-semibold text-sm";

        if (active) {
            return `${base}  bg-[#FFE8D9]  text-[#E85D04] w-[111px] h-[45px] `;
        }
        return `${base}  bg-white text-[#E85D04] hover:bg-orange-50 w-[111px] h-[45px] `;
    };

    const mapStatus = (status: string): "À faire" | "En cours" | "Terminé" => {
        switch (status) {
            case "TODO": return "À faire";
            case "IN_PROGRESS": return "En cours";
            case "DONE": return "Terminé";
            default: return "À faire";
        }
    };



    // Etape 2 : Le Tri des Données 🗂️

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const todoTasks = filteredTasks.filter(task => task.status === 'TODO');
    const inProgressTasks = filteredTasks.filter(task => task.status === 'IN_PROGRESS');
    const doneTasks = filteredTasks.filter(task => task.status === 'DONE');




    return (
        <div className="flex flex-col gap-8 ">
            <div className="flex gap-4">
                <button
                    onClick={() => setView('LIST')}
                    className={getLinkClass('LIST')}
                >
                    <Image
                        src="/images/Group-4.svg"
                        alt="Liste"
                        width={20}
                        height={20}

                    />
                    Liste
                </button>
                <button
                    onClick={() => setView('KANBAN')}
                    className={getLinkClass('KANBAN')}
                >
                    <Image
                        src="/images/union-2.svg"
                        alt="Kanban"
                        width={20}
                        height={20}

                    />
                    Kanban
                </button>
            </div>

            {/* Conteneur Principal pour la Vue Liste */}
            {view === 'LIST' && (
                <div>
                    <div className=" px-4 py-6 md:px-[59px] md:py-[40px] bg-white rounded-2xl">
                        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                <p className="text-[18px] font-semibold leading-normal">Mes tâches assignées</p>
                                <p className="text-[#6B7280] text-[16px] font-normal leading-normal">Par ordre de priorité</p>
                            </div>
                            <div className="w-full md:w-auto">
                                {/* Search Bar */}
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        placeholder="Rechercher une tâche"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 w-full md:w-64 hover:border-gray-300 transition-colors"
                                    />
                                    <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>

                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            {loading ? (
                                <p>Chargement des tâches...</p>
                            ) : tasks.length === 0 ? (
                                <p>Aucune tâche assignée pour le moment.</p>
                            ) : (
                                filteredTasks.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        title={task.title}
                                        description={task.description || "Pas de description"}
                                        projectName={task.project.name}
                                        projectId={task.project.id}
                                        dateLabel={task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Aucune date"}
                                        commentsCount={task.comments ? task.comments.length : 0}
                                        status={mapStatus(task.status)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Conteneur Principal pour la Vue Kanban */}
            {view === "KANBAN" && (
                <div className="flex gap-6 overflow-x-auto pb-4 items-start justify-center">
                    {[
                        {
                            key: "TODO",
                            title: "À faire",
                            tasks: todoTasks,
                        },
                        {
                            key: "IN_PROGRESS",
                            title: "En cours",
                            tasks: inProgressTasks,
                        },
                        {
                            key: "DONE",
                            title: "Terminées",
                            tasks: doneTasks,
                        },
                    ].map((column) => (
                        <div
                            key={column.key}
                            className="min-w-[320px] flex flex-col gap-4 bg-white rounded-2xl px-[20px] py-[20px] border border-gray-200"
                        >
                            {/* Header colonne */}
                            <div className="flex items-center gap-3 mb-2 px-1">
                                <h3 className="font-bold text-gray-900 text-lg">
                                    {column.title}
                                </h3>
                                <span className="bg-gray-200 text-gray-600 px-2.5 py-0.5 rounded-full text-sm font-medium">
                                    {column.tasks.length}
                                </span>
                            </div>

                            {/* Tasks */}
                            {column.tasks.map((task) => (
                                <TaskCardCompact
                                    projectId={task.project.id}
                                    key={task.id}
                                    title={task.title}
                                    description={task.description || "Pas de description"}
                                    projectName={task.project.name}
                                    dateLabel={
                                        task.dueDate
                                            ? new Date(task.dueDate).toLocaleDateString()
                                            : "Aucune date"
                                    }
                                    commentsCount={task.comments ? task.comments.length : 0}
                                    status={mapStatus(task.status)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}