'use client';

import ProjetCard from "../components/projetcard/ProjetCard";
import { useData } from "../context/DataContext";
import Link from "next/link";
import { useState } from "react";
import Modal from "../components/modal/Modal";
import ModalCreerProjet from "../components/modal/ModalCreerProjet";


export default function ProjetPage() {
    const { projects, loading } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 pt-4 md:pt-10">
                <div className="flex flex-col gap-2 w-full md:w-auto">
                    <h1 className="text-3xl font-bold text-gray-900">Mes projets</h1>
                    <div className="text-gray-500 text-sm md:text-base">
                        Gérez vos projets et suivez leur avancement
                    </div>
                </div>
                <div className="w-full md:w-auto flex-shrink-0">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-black text-white font-medium rounded-[12px] hover:bg-gray-800 transition-all w-full md:w-[185px] h-[52px] shadow-sm active:scale-95 flex items-center justify-center"
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