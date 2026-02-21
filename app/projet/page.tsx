'use client';

import ProjetCard from "../components/projetcard/ProjetCard";
import { useData } from "../context/DataContext";
import Link from "next/link";
import { useState } from "react";
import Modal from "../components/modal/Modal";
import ModalCreerProjet from "../components/modal/ModalCreerProjet";


export default function ProjetPage() {
    const { projectsWithTasks, projects, loading } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 pt-4 md:pt-10">
                <div className="flex flex-col gap-2 w-full md:w-auto">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-gray-900">Mes projets</h1>
                        {projectsWithTasks && projectsWithTasks.length > 0 && (
                            <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full" title="Projets avec tâches actives">
                                {projectsWithTasks.length} actif(s)
                            </span>
                        )}
                    </div>
                    <div className="text-gray-500 text-sm md:text-base">
                        Gérez vos projets et suivez leur avancement
                    </div>
                </div>
                <div className="w-full md:w-auto shrink-0">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all w-full md:w-[185px] md:h-[52px] shadow-sm active:scale-95 flex items-center justify-center p-3 md:p-0"
                    >
                        + Créer un projet
                    </button>
                </div>
            </div>

            {loading ? (
                <p>Chargement des projets...</p>
            ) : (
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <Link
                                key={project.id}
                                href={`/projet/${project.id}`}
                                className="block group rounded-2xl focus:outline-none"
                                tabIndex={0}
                            >
                                <ProjetCard
                                    title={project.title}
                                    description={project.description}
                                    progressPercent={project.progressPercent}
                                    doneTasks={project.doneTasks}
                                    totalTasks={project.totalTasks}
                                    teamCount={project.teamCount}
                                    ownerLabel={project.ownerLabel}
                                    ownerAvatars={project.ownerAvatars}
                                />
                            </Link>
                        ))}
                    </div>
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title="Créer un projet"
                    >
                        <ModalCreerProjet onClose={() => setIsModalOpen(false)} />
                    </Modal>
                </div>
            )}
        </div>
    );
}       