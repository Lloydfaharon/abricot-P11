import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = "http://localhost:8000";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    try {
        const [userRes, tasksRes, projectsRes, projectsWithTasksRes] = await Promise.all([
            fetch(`${API_URL}/auth/profile`, { headers }).catch(e => { console.error("User fetch error:", e); return null; }),
            fetch(`${API_URL}/dashboard/assigned-tasks`, { headers }).catch(e => { console.error("Tasks fetch error:", e); return null; }),
            fetch(`${API_URL}/projects`, { headers }).catch(e => { console.error("Projects fetch error:", e); return null; }),
            fetch(`${API_URL}/dashboard/projects-with-tasks`, { headers }).catch(e => { console.error("ProjectsWithTasks fetch error:", e); return null; })
        ]);

        const user = userRes?.ok ? (await userRes.json()).data?.user : null;

        let tasks = [];
        if (tasksRes?.ok) {
            const taskJson = await tasksRes.json();
            const rawTasks = taskJson.data?.tasks || taskJson.data || [];

            tasks = rawTasks.map((t: any) => {
                const normalizedCall = { ...t };

                if (!normalizedCall.assignees || normalizedCall.assignees.length === 0) {
                    const candidate = t.assignee || t.assignedTo || t.assigned_to;
                    if (candidate) {
                        normalizedCall.assignees = Array.isArray(candidate) ? candidate : [candidate];
                    } else {
                        normalizedCall.assignees = [];
                    }
                }
                return normalizedCall;
            });
        }

        let projects = [];
        if (projectsRes?.ok) {
            const projectJson = await projectsRes.json();
            const rawProjects = projectJson.data?.projects || projectJson.data || [];

            projects = await Promise.all(rawProjects.map(async (p: any) => {
                let doneCount = 0;
                let totalCount = p._count?.tasks || 0;

                try {
                    const detailRes = await fetch(`${API_URL}/projects/${p.id}`, { headers });
                    if (detailRes.ok) {
                        const detailJson = await detailRes.json();
                        const detailData = detailJson.data?.project || detailJson.data;

                        if (detailData && detailData.tasks) {
                            doneCount = detailData.tasks.filter((t: any) => t.status === 'DONE').length;
                            totalCount = detailData._count?.tasks || detailData.tasks.length || totalCount;
                        }
                    }
                } catch (err) {
                    console.warn(`Failed to fetch details for project ${p.id}`, err);
                }

                const getInitials = (name: string) => {
                    const parts = name.trim().split(' ');
                    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
                    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                };

                const ownerAvatar = { initials: getInitials(p.owner?.name || "Inconnu") };
                const memberAvatars = p.members?.map((m: any) => ({
                    initials: getInitials(m.user?.name || "Inconnu")
                })) || [];
                const allAvatars = [ownerAvatar, ...memberAvatars];

                const team = [
                    {
                        id: p.owner?.id || "owner",
                        email: p.owner?.email,
                        name: p.owner?.name || "Propriétaire",
                        initials: ownerAvatar.initials,
                        role: "Propriétaire"
                    },
                    ...(p.members?.map((m: any) => ({
                        id: m.user?.id || "unknown",
                        email: m.user?.email,
                        name: m.user?.name || "Membre",
                        initials: getInitials(m.user?.name || "Inconnu"),
                        role: m.role || "Membre"
                    })) || [])
                ];

                return {
                    id: p.id,
                    title: p.name || "Projet Sans Nom",
                    description: p.description || "",

                    progressPercent: totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0,
                    doneTasks: doneCount,
                    totalTasks: totalCount,

                    teamCount: allAvatars.length,
                    ownerLabel: "Propriétaire",
                    ownerAvatars: allAvatars,
                    team: team
                };
            }));
        } else {
            console.warn("Impossible de récupérer les projets via /projects");
        }

        let projectsWithTasks = [];
        if (projectsWithTasksRes?.ok) {
            const pwtJson = await projectsWithTasksRes.json();
            projectsWithTasks = pwtJson.data?.projects || pwtJson.data || [];
        } else {
            console.warn("Impossible de récupérer la vue détaillée détaillée dashboard/projects-with-tasks");
        }

        return NextResponse.json({
            success: true,
            data: {
                user,
                tasks,
                projects,
                projectsWithTasks
            }
        });

    } catch (error) {
        console.error('Unified API Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
