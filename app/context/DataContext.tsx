'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AssignedTask, taskService } from '../services/task';
import { ProjectData, projectService } from '../services/project';

import { toast } from 'sonner';

// Interface des données globales
interface GlobalData {
    user: any | null;
    tasks: AssignedTask[];
    projects: ProjectData[];
    loading: boolean;
    refreshData: () => Promise<void>;
    createTask: (projectId: string, data: any) => Promise<void>;
    createProject: (data: any) => Promise<void>;
    updateProject: (projectId: string, data: any) => Promise<void>;
    deleteTask: (projectId: string, taskId: string) => Promise<void>;
    deleteProject: (projectId: string) => Promise<void>;
}

const DataContext = createContext<GlobalData>({
    user: null,
    tasks: [],
    projects: [],
    loading: true,
    refreshData: async () => { },
    createTask: async () => { },
    createProject: async () => { },
    updateProject: async () => { },
    deleteTask: async () => { },
    deleteProject: async () => { },
});

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState<AssignedTask[]>([]);
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api');
            if (response.ok) {
                const json = await response.json();
                if (json.success && json.data) {
                    setUser(json.data.user);
                    setTasks(json.data.tasks || []);
                    setProjects(json.data.projects || []);
                }
            }
        } catch (error) {
            console.error("Erreur récupération données globales:", error);
        } finally {
            setLoading(false);
        }
    };

    const createTask = async (projectId: string, data: any) => {
        try {
            const payload = {
                title: data.title,
                description: data.description,
                status: data.status || "TODO",
                priority: data.priority || "MEDIUM",
                dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
                projectId: projectId,
                creatorId: (user as any)?.id,
                assigneeIds: data.assignees || []
            };

            const res = await taskService.createTask(projectId, payload);

            // Mise à jour optimiste locale
            let newTask = res;

            if (newTask && newTask.id) {
                const isProjectInvalid = !newTask.project || typeof newTask.project !== 'object' || !newTask.project.id;

                if (isProjectInvalid && projectId) {
                    const currentProject = projects.find(p => p.id === projectId);
                    if (currentProject) {
                        newTask = {
                            ...newTask,
                            project: {
                                id: projectId,
                                name: currentProject.title,
                                description: currentProject.description || null
                            }
                        };
                    }
                }

                setTasks((prevTasks) => {
                    if (prevTasks.find(t => t.id === newTask.id)) return prevTasks;
                    return [newTask, ...prevTasks];
                });
            }

            refreshData();

            toast.success("Tâche créée avec succès !");

        } catch (error) {
            console.error("Context: Erreur creation:", error);
            throw error;
        }
    };

    const createProject = async (data: any) => {
        try {
            await projectService.createProject(data);
            await refreshData();
        } catch (error) {
            console.error("Context: Erreur creation projet:", error);
            throw error;
        }
    };

    const updateProject = async (projectId: string, data: any) => {
        try {
            const { contributors, ...projectData } = data;

            // Mise à jour du projet
            await projectService.updateProject(projectId, projectData);

            // Gestion des contributeurs
            if (contributors && Array.isArray(contributors)) {
                const currentProject = projects.find(p => p.id === projectId);
                if (currentProject) {
                    const currentTeam = currentProject.team.filter(m => m.role !== 'Propriétaire' && m.id !== 'owner');
                    const currentEmails = currentTeam.map(m => m.email).filter((e): e is string => !!e);

                    const toAdd = contributors.filter(email => !currentEmails.includes(email));
                    const toRemove = currentTeam.filter(m => m.email && !contributors.includes(m.email));

                    await Promise.all(toAdd.map(email => projectService.addContributor(projectId, email)));
                    await Promise.all(toRemove.map(m => projectService.removeContributor(projectId, m.id)));
                }
            }

            await refreshData();
        } catch (error) {
            console.error("Context: Erreur update projet:", error);
            throw error;
        }
    };

    const deleteTask = async (projectId: string, taskId: string) => {
        // Sauvegarde de l'état précédent pour rollback en cas d'erreur
        const previousTasks = tasks;

        // Mise à jour immédiate (Optimistic UI)
        setTasks((prevTasks) => prevTasks.filter(t => t.id !== taskId));

        try {
            // 2. Appel API en arrière-plan
            await taskService.deleteTask(projectId, taskId);

            // Pas besoin de refreshData() ici car l'état local est déjà à jour
        } catch (error) {
            console.error("Context: Erreur suppression tâche:", error);

            // Rollback en cas d'erreur
            setTasks(previousTasks);
            toast.error("Impossible de supprimer la tâche");
        }
    };

    const deleteProject = async (projectId: string) => {
        try {
            await projectService.deleteProject(projectId);
            setProjects((prev) => prev.filter(p => p.id !== projectId));
            toast.success("Projet supprimé avec succès");
        } catch (error) {
            console.error("Context: Erreur suppression projet:", error);
            toast.error("Impossible de supprimer le projet");
            throw error;
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <DataContext.Provider value={{ user, tasks, projects, loading, refreshData, createTask, createProject, updateProject, deleteTask, deleteProject }}>
            {children}
        </DataContext.Provider>
    );
};
