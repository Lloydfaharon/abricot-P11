'use client';

import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface AssignedTask {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    dueDate: string | null;
    project: {
        id: string;
        name: string;
        description: string | null;
    };
    comments: any[];
    assignees: any[];
}

export const taskService = {
    getAssignedTasks: async (): Promise<AssignedTask[]> => {
        const token = Cookies.get('token');
        try {
            const response = await fetch(`${API_URL}/dashboard/assigned-tasks`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Impossible de récupérer les tâches assignées');
            }

            const responseData = await response.json();
            return responseData.data.tasks;
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('Error fetching assigned tasks:', error);
            }
            throw error;
        }
    },

    getProjectTasks: async (projectId: string): Promise<AssignedTask[]> => {
        const token = Cookies.get('token');

        const url = `${API_URL}/projects/${projectId}/tasks?limit=100&page_size=100`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Impossible de récupérer les tâches du projet');
            }

            const responseData = await response.json();
            const tasks = responseData.data?.tasks || responseData.tasks || responseData.data || [];


            return tasks.map((t: any) => {
                const normalized = { ...t };
                if (!normalized.assignees || normalized.assignees.length === 0) {
                    const candidate = t.assignee || t.assignedTo || t.assigned_to;
                    if (candidate) {
                        normalized.assignees = Array.isArray(candidate) ? candidate : [candidate];
                    } else {
                        normalized.assignees = [];
                    }
                }
                return normalized;
            });

        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('Error fetching project tasks:', error);
            }
            return [];
        }
    },

    addComment: async (projectId: string, taskId: string, content: string): Promise<any> => {
        const token = Cookies.get('token');
        try {
            const response = await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) {
                const errorText = await response.text();
                if (process.env.NODE_ENV !== 'production') {
                    console.error(`API Error (${response.status}):`, errorText);
                }
                throw new Error(`Impossible d'ajouter le commentaire: ${response.status} ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('Error adding comment:', error);
            }
            throw error;
        }
    },

    createTask: async (projectId: string, data: any): Promise<AssignedTask> => {
        const token = Cookies.get('token');
        const url = `${API_URL}/projects/${projectId}/tasks`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                if (process.env.NODE_ENV !== 'production') {
                    console.error(`API Error (${response.status}):`, errorText);
                }
                throw new Error(`Impossible de créer la tâche: ${response.status} ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('Error creating task:', error);
            }
            throw error;
        }
    },

    updateTask: async (projectId: string, taskId: string, data: any): Promise<any> => {
        const token = Cookies.get('token');
        const url = `${API_URL}/projects/${projectId}/tasks/${taskId}`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                if (process.env.NODE_ENV !== 'production') {
                    console.error(`API Error (${response.status}):`, errorText);
                }
                throw new Error(`Impossible de modifier la tâche: ${response.status} ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('Error updating task:', error);
            }
            throw error;
        }
    },

    deleteTask: async (projectId: string, taskId: string): Promise<void> => {
        const token = Cookies.get('token');
        const url = `${API_URL}/projects/${projectId}/tasks/${taskId}`;

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                if (process.env.NODE_ENV !== 'production') {
                    console.error(`API Error (${response.status}):`, errorText);
                }
                throw new Error(`Impossible de supprimer la tâche: ${response.status} ${errorText}`);
            }
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('Error deleting task:', error);
            }
            throw error;
        }
    }
};
