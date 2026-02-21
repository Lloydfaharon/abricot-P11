import { NextRequest, NextResponse } from 'next/server';
import { Document, VectorStoreIndex, Settings } from "llamaindex";
import { MistralAI, MistralAIEmbedding, MistralAIEmbeddingModelType } from "@llamaindex/mistral";
import { z } from "zod";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.split(" ")[1];

        if (!token) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const baseUrl = API_URL.startsWith('http') ? API_URL : `${req.nextUrl.origin}${API_URL}`;

            const authResponse = await fetch(`${baseUrl}/auth/profile`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (authResponse.status === 401) {
                return NextResponse.json({ message: "Session expirée" }, { status: 401 });
            }

            if (!authResponse.ok) {
                const text = await authResponse.text();
                throw new Error(`Django error: ${authResponse.status} ${text}`);
            }

        } catch (e: any) {
            console.error("Fetch profile error:", e);
            const msg = e.name === 'AbortError' ? "Serveur d'auth trop lent" : "Erreur auth";
            return NextResponse.json({ message: msg }, { status: 503 });
        }


        const { demandeUtilisateur, tachesExistantes = [] } = await req.json();
        if (!demandeUtilisateur) return NextResponse.json({ message: "Demande requise" }, { status: 400 });

        const apiKey = process.env.MISTRAL_API_KEY;

        Settings.llm = new MistralAI({
            apiKey,
            model: "mistral-small-latest",
            additionalKwargs: { response_format: { type: "json_object" } }
        } as any);

        Settings.embedModel = new MistralAIEmbedding({
            apiKey,
            model: MistralAIEmbeddingModelType.MISTRAL_EMBED
        });

        const documents = tachesExistantes.map((t: any) => new Document({
            text: `Tâche: ${t.title}. Description: ${t.description || ''}`,
            metadata: { id: t.id }
        }));

        if (documents.length === 0) documents.push(new Document({ text: "Aucune tâche." }));

        const index = await VectorStoreIndex.fromDocuments(documents);
        const queryEngine = index.asQueryEngine({ similarityTopK: 20 });

        const promptSystem = `
        Tu es un expert en gestion de projet.
        Génère une liste de NOUVELLES tâches pour répondre à : "${demandeUtilisateur}".
        Ta réponse doit compléter le projet sans créer de doublons avec les tâches contextuelles.
        Réponds UNIQUEMENT avec un tableau JSON d'objets.
        Chaque objet doit avoir : "name" (titre) et "description".
        Le format doit être un tableau JSON valide, sans texte avant ni après.
        Exemple : [{"name": "...", "description": "..."}]
        `;

        const response = await queryEngine.query({ query: promptSystem });
        let content = response.toString();

        let tasks;
        try {
            const cleanContent = content.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanContent);
            const rawTasks = Array.isArray(parsed) ? parsed : (parsed.tasks || []);

            const TaskSchema = z.object({
                name: z.string().min(1, "Le nom de la tâche est requis"),
                description: z.string().optional().default("")
            });
            const TaskArraySchema = z.array(TaskSchema);

            tasks = TaskArraySchema.parse(rawTasks);

        } catch (e: any) {
            console.error("Erreur de validation JSON/Zod:", e);
            return NextResponse.json(
                { message: "Erreur de format de la réponse IA", details: e.errors || "Format JSON invalide", raw: content },
                { status: 500 }
            );
        }

        return NextResponse.json(tasks);

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}