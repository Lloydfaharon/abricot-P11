"use client";

import { useParams } from "next/navigation";
import { useData } from "@/app/context/DataContext";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { ChevronDown, Search } from 'lucide-react';
import TacheListeCard from "@/app/components/tachelistecard/TacheListeCard";
import Modal from "@/app/components/modal/Modal";
import ModalCreateTask from "@/app/components/modal/ModalCreerTache";
import { taskService, AssignedTask } from "@/app/services/task";
import ModalModifierProjet from "@/app/components/modal/ModalModifierProjet";
import Iataskmanager from "@/app/components/ia/IATaskManager";



export default function ProjectDetailPage() {
    const params = useParams();
    const { projects, loading, tasks, createTask, user } = useData();
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<'TODO' | 'IN_PROGRESS' | 'DONE' | null>(null);
    type ModalType = "CREATE" | "MODIFIER" | "IA" | null;
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    // État local pour les tâches DU PROJET (et pas seulement les assignées)
    const [localTasks, setLocalTasks] = useState<AssignedTask[]>([]);

    const projectId = params.id as string;

    const fetchProjectTasks = useCallback(async () => {
        if (!projectId) return;
        try {
            console.log("Page: Fetching tasks for project:", projectId);
            const fetched = await taskService.getProjectTasks(projectId);
            console.log("Page: Fetched tasks:", fetched.length);
            setLocalTasks(fetched);
        } catch (e) {
            console.error("Page: Error fetching tasks", e);
        }
    }, [projectId]);

    useEffect(() => {
        fetchProjectTasks();
    }, [fetchProjectTasks]);





    const project = projects.find((p) => p.id === projectId);

    if (loading && projects.length === 0) return <div className="p-10">Chargement...</div>;

    if (!project) {
        return (
            <div className="p-10">
                <h1 className="text-2xl font-bold text-red-500">
                    Projet introuvable
                </h1>
                <Link
                    href="/projet"
                    className="text-blue-500 hover:underline  mt-4 block"
                >
                    <div>←</div>
                </Link>
            </div>
        );
    }


    const projectMembers = project?.team?.map(m => ({
        id: m.userId || m.id,
        name: m.name
    })) || [];

    const canEdit = project?.team?.some(m => m.id === user?.id && (m.role === 'Propriétaire' || m.role === 'Admin'));

    return (
        <div className="relative">
            <Link
                href="/projet"
                className="inline-flex items-center text-sm text-gray-400 hover:text-orange-500 mb-6 transition-colors md:absolute md:top-0 md:-left-15"
            >
                <div className="bg-white rounded-md  h-12.5 w-12.5 flex justify-center items-center border border-gray-300 hover:border-orange-500">
                    ←
                </div>
            </Link>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
                <div>
                    <div className="flex items-center gap-2 ">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {project.title}
                        </h1>
                        {canEdit && (
                            <button onClick={() => setActiveModal("MODIFIER")} className="text-[14px] text-orange-500 cursor-pointer bg-transparent border-none outline-none hover:underline focus:ring-2 focus:ring-orange-200 rounded px-1">
                                Modifier
                            </button>
                        )}
                    </div>

                    <p className="mt-2 text-gray-500">{project.description}</p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button onClick={() => setActiveModal("CREATE")} className="bg-black text-[16px] text-white w-full md:w-35.25 h-12.5 rounded-[10px] cursor-pointer">Créer une tâche</button>
                    <button onClick={() => setActiveModal("IA")} className=" flex items-center gap-2  justify-center bg-orange-500 text-[16px] text-white w-23.5 h-12.5 rounded-[10px] cursor-pointer"><Image
                        src="/images/star 1.svg"
                        alt="Liste"
                        width={20}
                        height={20}

                    />IA</button>
                </div>
            </div>
            {/* Section Contributeurs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-100 rounded-[10px] px-4 py-4 md:px-8 mb-8 border border-gray-100 mt-8 md:mt-15">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">Contributeurs</span>
                        <span className="text-xs text-gray-500">{project.teamCount} personnes</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    <div className="flex items-center gap-2 md:gap-4">
                        {(() => {
                            const uniqueTeam = new Map();
                            project.team?.forEach(m => {
                                const current = uniqueTeam.get(m.id);
                                // On ajoute si pas présent, ou si le nouveau a le rôle 'Propriétaire' (prioritaire)
                                if (!current || m.role === 'Propriétaire') {
                                    uniqueTeam.set(m.id, m);
                                }
                            });

                            return Array.from(uniqueTeam.values()).map((member: any, idx) => (
                                <div key={member.id || idx} className="flex items-center gap-2" title={member.name}>
                                    {/* Avatar Circle */}
                                    <span className={`flex h-10 w-10 md:h-8 md:w-8 items-center justify-center rounded-full text-[12px] md:text-[10px] font-bold ${member.role === 'Propriétaire'
                                        ? 'bg-orange-100 text-gray-800'
                                        : 'bg-white border border-gray-200 text-gray-800'
                                        }`}>
                                        {member.initials}
                                    </span>

                                    {/* Name/Role Pill - Hidden on mobile */}
                                    <div className={`hidden md:block px-4 py-1.5 rounded-full text-sm font-medium ${member.role === 'Propriétaire'
                                        ? 'bg-orange-100 text-orange-600'
                                        : 'bg-white border border-gray-200 text-gray-600'
                                        }`}>
                                        {member.role === 'Propriétaire' ? 'Propriétaire' : member.name}
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 px-4 py-6 md:px-14.75 md:py-10 ">


                <div >
                    <div className=" flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 ">
                        <div>
                            <h2 className="text-[20px] font-bold">Taches</h2>
                            <p className="text-[16px] text-gray-500">Par ordre de priorité</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mt-6 w-full xl:w-auto">

                            <div className="flex items-center gap-2 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`flex items-center gap-2 px-4 py-3.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list'
                                        ? 'bg-orange-100/80 text-orange-700'
                                        : 'text-orange-700 hover:bg-orange-100/30'
                                        }`}
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
                                    onClick={() => setViewMode('calendar')}
                                    className={`flex items-center gap-2 px-4 py-3.5  rounded-md text-sm font-medium transition-all ${viewMode === 'calendar'
                                        ? 'bg-orange-100/80 text-orange-700 '
                                        : 'text-orange-700 hover:bg-orange-100/30'
                                        }`}
                                >
                                    <Image
                                        src="/images/union-2.svg"
                                        alt="Kanban"
                                        width={20}
                                        height={20}

                                    />
                                    Calendrier
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
                                {/* Status Filter */}
                                <div className="relative group w-full md:w-auto">
                                    <select
                                        aria-label="Statut"
                                        value={statusFilter ?? ""}
                                        onChange={(e) => setStatusFilter((e.target.value as "TODO" | "IN_PROGRESS" | "DONE") || null)}
                                        className="appearance-none bg-white border border-gray-200 text-gray-600 text-sm rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-100 hover:border-gray-300 transition-colors cursor-pointer w-full md:min-w-30"
                                    >
                                        <option value="">Statut</option>
                                        <option value="TODO">À faire</option>
                                        <option value="IN_PROGRESS">En cours</option>
                                        <option value="DONE">Terminé</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>

                                {/* Search Bar */}
                                <div className="relative w-full md:w-auto">
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


                    </div>



                    <div className="mt-6">
                        {/* Vue LISTE */}
                        {viewMode === 'list' && (
                            <div className="flex flex-col gap-4">
                                {(() => {
                                    const projectTasks = localTasks.filter(t => {
                                        const taskProjectId = t.project?.id || (t as any).projectId;
                                        const matchesProject = taskProjectId === projectId;

                                        if (!matchesProject) return false;

                                        if (searchQuery) {
                                            const query = searchQuery.toLowerCase();
                                            const matchesTitle = t.title.toLowerCase().includes(query);
                                            const matchesDesc = t.description?.toLowerCase().includes(query);
                                            if (!matchesTitle && !matchesDesc) return false;
                                        }

                                        if (statusFilter && t.status !== statusFilter) return false;

                                        return true;
                                    });

                                    console.log("Page: Tasks after filter:", projectTasks.length);

                                    if (projectTasks.length === 0) {
                                        return (
                                            <div className="text-gray-500 text-sm italic py-4">
                                                Aucune tâche pour ce projet.
                                            </div>
                                        );
                                    }

                                    // Tri par priorité
                                    projectTasks.sort((a, b) => {
                                        const priorityWeight: Record<string, number> = {
                                            "HIGH": 3,
                                            "MEDIUM": 2,
                                            "LOW": 1
                                        };
                                        const wA = priorityWeight[a.priority] || 0;
                                        const wB = priorityWeight[b.priority] || 0;
                                        return wB - wA;
                                    });

                                    return projectTasks.map((task) => (
                                        <TacheListeCard
                                            key={task.id}
                                            id={task.id}
                                            projectId={projectId}
                                            members={projectMembers}
                                            isoDueDate={task.dueDate || undefined}
                                            onUpdate={fetchProjectTasks}
                                            title={task.title}
                                            status={task.status}
                                            priority={task.priority}
                                            description={task.description || "Aucune description"}
                                            dueDate={task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                                            assignees={task.assignees?.map((a: any) => {
                                                // Gestion des différents formats (ID string ou Objet User)
                                                let userName = "Inconnu";
                                                let initials = "??";

                                                if (typeof a === 'string') {
                                                    // C'est un ID, on cherche dans l'équipe du projet
                                                    const member = project?.team?.find(m => m.id === a);
                                                    if (member) {
                                                        userName = member.name;
                                                        initials = member.initials;
                                                    }
                                                } else {
                                                    // C'est un objet
                                                    userName = a.user?.name || a.name || "Inconnu";
                                                    // Recalcul des initiales si non présentes
                                                    const parts = userName.trim().split(' ');
                                                    initials = parts.length === 1
                                                        ? parts[0].substring(0, 2).toUpperCase()
                                                        : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                                                }

                                                return {
                                                    name: userName,
                                                    initials: initials
                                                };
                                            }) || []}
                                            commentCount={task.comments?.length || 0}
                                            comments={task.comments?.map((c: any) => ({
                                                id: c.id,
                                                content: c.content,
                                                author: { name: c.author?.name || c.user?.name || "Inconnu" },
                                                createdAt: c.createdAt
                                            })) || []}
                                        />
                                    ));
                                })()}
                            </div>
                        )}

                        {/* Vue CALENDRIER */}
                        {viewMode === 'calendar' && (
                            <div className="flex flex-col gap-8">
                                {(() => {
                                    console.log("Page: Rendering LOCAL tasks list. Total loaded:", localTasks.length);

                                    const projectTasks = localTasks
                                        .filter(t => {
                                            const currentId = (t as any).projectId || t.project?.id;
                                            const matchesProject = currentId === projectId;

                                            if (!matchesProject) return false;

                                            if (searchQuery) {
                                                const query = searchQuery.toLowerCase();
                                                return t.title.toLowerCase().includes(query) ||
                                                    t.description?.toLowerCase().includes(query);
                                            }

                                            if (statusFilter && t.status !== statusFilter) return false;

                                            return true;
                                        })
                                        // TRI : Par priorité (HIGH > MEDIUM > LOW)
                                        .sort((a: any, b: any) => {
                                            const priorityWeight: Record<string, number> = {
                                                "HIGH": 3,
                                                "MEDIUM": 2,
                                                "LOW": 1
                                            };
                                            const wA = priorityWeight[a.priority] || 0;
                                            const wB = priorityWeight[b.priority] || 0;
                                            return wB - wA; // Descending
                                        });

                                    console.log("Page: Tasks after filter & sort:", projectTasks.length);
                                    if (projectTasks.length === 0) {
                                        return (
                                            <div className="text-gray-500 text-sm italic py-4">
                                                Aucune tâche pour ce projet.
                                            </div>
                                        );
                                    }

                                    // Groupement par date pour l'affichage
                                    const groups = projectTasks.reduce((acc, task) => {
                                        const rawDate = task.dueDate ? new Date(task.dueDate).getTime() : 9999999999999;
                                        const dateLabel = task.dueDate ? new Date(task.dueDate).toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long'
                                        }) : "Sans date";
                                        const capitalizedLabel = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1);

                                        if (!acc[capitalizedLabel]) {
                                            acc[capitalizedLabel] = {
                                                label: capitalizedLabel,
                                                timestamp: rawDate,
                                                tasks: []
                                            };
                                        }
                                        acc[capitalizedLabel].tasks.push(task);
                                        return acc;
                                    }, {} as Record<string, { label: string, timestamp: number, tasks: typeof projectTasks }>);

                                    const sortedSections = Object.values(groups).sort((a, b) => a.timestamp - b.timestamp);

                                    return sortedSections.map((section) => (
                                        <details
                                            key={section.label}
                                            className="group open:pb-4"
                                            open
                                        >
                                            <summary className="list-none flex items-center gap-2 cursor-pointer py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 rounded-md">
                                                <div className="text-gray-400 transform transition-transform group-open:rotate-90">
                                                    <ChevronDown size={20} />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-800 capitalize select-none">
                                                    {section.label}
                                                </h3>
                                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                    {section.tasks.length}
                                                </span>
                                            </summary>

                                            <div className="flex flex-col gap-4 pl-7 mt-2">
                                                {section.tasks.map((task) => (
                                                    <TacheListeCard
                                                        key={task.id}
                                                        id={task.id}
                                                        projectId={projectId}
                                                        members={projectMembers}
                                                        isoDueDate={task.dueDate || undefined}
                                                        onUpdate={fetchProjectTasks}
                                                        title={task.title}
                                                        status={task.status}
                                                        priority={task.priority}
                                                        description={task.description || "Aucune description"}
                                                        dueDate={task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                                                        assignees={task.assignees?.map((a: any) => {
                                                            // Gestion des différents formats (ID string ou Objet User)
                                                            let userName = "Inconnu";
                                                            let initials = "??";

                                                            if (typeof a === 'string') {
                                                                // C'est un ID, on cherche dans l'équipe du projet
                                                                const member = project?.team?.find(m => m.id === a);
                                                                if (member) {
                                                                    userName = member.name;
                                                                    initials = member.initials;
                                                                }
                                                            } else {
                                                                // C'est un objet
                                                                userName = a.user?.name || a.name || "Inconnu";
                                                                const parts = userName.trim().split(' ');
                                                                initials = parts.length === 1
                                                                    ? parts[0].substring(0, 2).toUpperCase()
                                                                    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                                                            }

                                                            return {
                                                                name: userName,
                                                                initials: initials
                                                            };
                                                        }) || []}
                                                        commentCount={task.comments?.length || 0}
                                                        comments={task.comments?.map((c: any) => ({
                                                            id: c.id,
                                                            content: c.content,
                                                            author: { name: c.author?.name || c.user?.name || "Inconnu" },
                                                            createdAt: c.createdAt
                                                        })) || []}
                                                    />
                                                ))}
                                            </div>
                                        </details>
                                    ));
                                })()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                isOpen={activeModal === "CREATE"}
                onClose={() => setActiveModal(null)}

            >
                <ModalCreateTask
                    members={projectMembers}
                    onSubmit={async (data) => {
                        try {
                            const payload = {
                                ...data,
                                dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null
                            };
                            await createTask(projectId, payload);
                            await fetchProjectTasks();
                            setActiveModal(null);
                        } catch (error) {
                            console.error("Erreur création tâche:", error);
                            alert("Erreur lors de la création de la tâche");
                        }
                    }} />
            </Modal>

            <Modal
                isOpen={activeModal === "MODIFIER"}
                onClose={() => setActiveModal(null)}
                title="Modifier le projet"
            >
                {project && <ModalModifierProjet project={project} onClose={() => setActiveModal(null)} />}
            </Modal>

            <Modal
                isOpen={activeModal === "IA"}
                onClose={() => setActiveModal(null)}
                title=""
            >
                <Iataskmanager
                    projectId={projectId}
                    onClose={() => setActiveModal(null)}
                    onSuccess={fetchProjectTasks}
                    members={projectMembers}
                    existingTasks={localTasks}
                />
            </Modal>

        </div >
    );
}
