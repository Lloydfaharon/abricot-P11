import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ProjectData {
    id: string;
    title: string;
    description: string;
    progressPercent: number;
    doneTasks: number;
    totalTasks: number;
    teamCount: number;
    ownerLabel: string;
    team: {
        id: string;
        userId?: string; // ID de l'utilisateur (optionnel si pas toujours renvoyé par le mock)
        email?: string;
        name: string;
        initials: string;
        role: string; // "Propriétaire" | "Membre"
    }[];
    ownerAvatars: { initials: string }[];
}

export const projectService = {
    getProjects: async (): Promise<ProjectData[]> => {
        // Données statiques pour le développement
        return [
            {
                id: '1',
                title: 'Refonte Site Web',
                description: 'Modernisation de la landing page et du dashboard.',
                progressPercent: 65,
                doneTasks: 13,
                totalTasks: 20,
                teamCount: 4,
                ownerLabel: 'Tech Lead',
                ownerAvatars: [{ initials: 'AL' }, { initials: 'BK' }, { initials: 'CD' }],
                team: []
            },
            {
                id: '2',
                title: 'Application Mobile',
                description: 'Développement de la version iOS et Android.',
                progressPercent: 30,
                doneTasks: 6,
                totalTasks: 20,
                teamCount: 6,
                ownerLabel: 'Product Owner',
                ownerAvatars: [{ initials: 'MP' }, { initials: 'TF' }],
                team: []
            },
            {
                id: '3',
                title: 'Campagne Marketing',
                description: 'Lancement de la publicité sur les réseaux sociaux.',
                progressPercent: 90,
                doneTasks: 18,
                totalTasks: 20,
                teamCount: 3,
                ownerLabel: 'Marketing',
                ownerAvatars: [{ initials: 'JL' }, { initials: 'SA' }],
                team: []
            }
        ];
    },

    createProject: async (data: any): Promise<any> => {
        const token = Cookies.get('token');

        const response = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur lors de la création du projet: ${errorText}`);
        }

        return await response.json();
    },

    updateProject: async (projectId: string, data: any): Promise<any> => {
        const token = Cookies.get('token');
        const response = await fetch(`${API_URL}/projects/${projectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur lors de la mise à jour du projet: ${errorText}`);
        }

        return await response.json();
    },

    addContributor: async (projectId: string, email: string): Promise<any> => {
        const token = Cookies.get('token');
        const response = await fetch(`${API_URL}/projects/${projectId}/contributors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur lors de l'ajout du contributeur: ${errorText}`);
        }

        return await response.json();
    },

    removeContributor: async (projectId: string, userId: string): Promise<any> => {
        const token = Cookies.get('token');
        const response = await fetch(`${API_URL}/projects/${projectId}/contributors/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur lors du retrait du contributeur: ${errorText}`);
        }

        return await response.json();
    }
};
