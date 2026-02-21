'use client';

import Image from "next/image";
import { useState } from "react";
import TaskCard from "../taskcard/TaskCard";
import TaskCardCompact from "../taskcard/TaskCardCompact";
import { useData } from "@/app/context/DataContext";
import { Search } from "lucide-react";


export default function InterfacesTdB() {
    const { tasks, projectsWithTasks, loading } = useData();
    const [view, setView] = useState<'LIST' | 'KANBAN' | 'PROJECTS'>('LIST');
    const [searchQuery, setSearchQuery] = useState("");


    const isViewActive = (currentView: 'LIST' | 'KANBAN') => view === currentView;

    const getLinkClass = (targetView: 'LIST' | 'KANBAN') => {
        const active = isViewActive(targetView);
        const base = "flex items-center justify-center gap-3 px-6 py-3 rounded-[10px] transition-all font-semibold text-sm";

        if (active) {
            return `${base}  bg-[#FFE8D9]  text-orange-600 w-28 h-11 `;
        }
        return `${base}  bg-white text-orange-600 hover:bg-orange-50 w-28 h-11 `;
    };

    const mapStatus = (status: string): "À faire" | "En cours" | "Terminé" => {
        switch (status) {
            case "TODO": return "À faire";
            case "IN_PROGRESS": return "En cours";
            case "DONE": return "Terminé";
            default: return "À faire";
        }
    };



    const priorityWeight: Record<string, number> = {
        'HIGH': 3,
        'MEDIUM': 2,
        'LOW': 1
    };

    const filteredTasks = tasks
        .filter(task =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.description?.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => {
            const weightA = priorityWeight[a.priority] || 0;
            const weightB = priorityWeight[b.priority] || 0;
            return weightB - weightA; // Tri décroissant (HIGH en premier)
        });

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
                        alt="bouton Liste"
                        width={20}
                        height={20}
                        className="w-auto h-auto"
                    />
                    Liste
                </button>
                <button
                    onClick={() => setView('KANBAN')}
                    className={getLinkClass('KANBAN')}
                >
                    <Image
                        src="/images/union-2.svg"
                        alt="bouton Kanban"
                        width={20}
                        height={20}
                        className="w-auto h-auto"
                    />
                    Kanban
                </button>
            </div>

            {/* Conteneur Principal pour la Vue Liste */}
            {view === 'LIST' && (
                <div>
                    <div className=" px-4 py-6 md:px-14.75 md:py-10 bg-white rounded-2xl">
                        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                <p className="text-lg font-semibold leading-normal">Mes tâches assignées</p>
                                <p className="text-[#6B7280] text-base font-normal leading-normal">Par ordre de priorité</p>
                            </div>
                            <div className="w-full md:w-auto">
                                {/* Search Bar */}
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        aria-label="Rechercher une tâche"
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
                <div className="flex flex-col  lg:flex-row gap-6 overflow-x-auto pb-4 items-start justify-center">
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
                            className="w-full  lg:min-w-80 flex justify-center items-center flex-col gap-4 bg-white rounded-2xl  px-5 py-5 border border-gray-200"
                        >
                            {/* Header colonne */}
                            <div className="flex items-center gap-3 mb-2 px-1">
                                <h2 className="font-bold text-gray-900 text-lg">
                                    {column.title}
                                </h2>
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

            {/* Conteneur Principal pour la Vue Projets avec Tâches */}
            {view === 'PROJECTS' && (
                <div>
                    <div className="px-4 py-6 md:px-14.75 md:py-10 bg-white rounded-2xl">
                        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                <p className="text-lg font-semibold leading-normal">Projets et tâches</p>
                                <p className="text-[#6B7280] text-base font-normal leading-normal">Vue d'ensemble détaillée</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-8">
                            {loading ? (
                                <p>Chargement des projets...</p>
                            ) : (!projectsWithTasks || projectsWithTasks.length === 0) ? (
                                <p>Aucun projet détaillé pour le moment.</p>
                            ) : (
                                projectsWithTasks.map((project: any) => (
                                    <div key={project.id} className="border border-gray-200 rounded-xl p-6 shadow-sm">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                                            <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                                {project.tasks?.length || 0} tâches
                                            </span>
                                        </div>
                                        <p className="text-gray-500 mb-6">{project.description}</p>

                                        {/* Liste des tâches imbriquées */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {project.tasks?.map((task: any) => (
                                                <TaskCardCompact
                                                    projectId={project.id}
                                                    key={task.id}
                                                    title={task.title}
                                                    description={task.description || "Pas de description"}
                                                    projectName={project.name}
                                                    dateLabel={task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Aucune date"}
                                                    commentsCount={task.comments ? task.comments.length : 0}
                                                    status={mapStatus(task.status)}
                                                />
                                            ))}
                                            {(!project.tasks || project.tasks.length === 0) && (
                                                <p className="text-sm text-gray-400 italic">Aucune tâche dans ce projet</p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}