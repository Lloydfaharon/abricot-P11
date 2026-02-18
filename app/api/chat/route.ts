
import { NextResponse } from 'next/server';
import { Document, VectorStoreIndex, Settings } from "llamaindex";
import { MistralAI, MistralAIEmbedding, MistralAIEmbeddingModelType } from "@llamaindex/mistral";

export async function POST(req: Request) {
    try {
        const { demandeUtilisateur, tachesExistantes } = await req.json();

        if (!demandeUtilisateur) {
            return NextResponse.json(
                { message: "La demande utilisateur est requise" },
                { status: 400 }
            );
        }

        const apiKey = process.env.MISTRAL_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { message: "Clé API Mistral manquante" },
                { status: 500 }
            );
        }

        // Configuration de LlamaIndex pour utiliser Mistral (LLM et Embeddings)
        Settings.llm = new MistralAI({
            apiKey: apiKey,
            model: "mistral-small-latest",
            additionalKwargs: { response_format: { type: "json_object" } } // Force le JSON
        } as any);

        Settings.embedModel = new MistralAIEmbedding({
            apiKey: apiKey,
            model: MistralAIEmbeddingModelType.MISTRAL_EMBED
        });

        // 1. Créer des Documents à partir des tâches existantes
        // Transformer les tâches en format texte pour l'indexation
        const documents = (tachesExistantes || []).map((t: any) => new Document({
            text: `Titre: ${t.title}, Statut: ${t.status || 'TODO'}, Description: ${t.description || ''}`,
            metadata: { id: t.id, title: t.title }
        }));

        // Si aucun document, on en crée un factice pour permettre la création de l'index
        if (documents.length === 0) {
            documents.push(new Document({ text: "Aucune tâche existante." }));
        }

        // 2. Créer le VectorStoreIndex (RAG)
        // Cela indexe les documents en mémoire pour la récupération
        const index = await VectorStoreIndex.fromDocuments(documents);

        // 3. Créer le moteur de recherche (Query Engine)
        const queryEngine = index.asQueryEngine();

        // 4. Interroger le moteur
        const promptSystem = `
      Tu es un expert en gestion de projet.
      Génère une liste de NOUVELLES tâches pour répondre à : "${demandeUtilisateur}".
      Ta réponse doit compléter le projet sans créer de doublons avec les tâches contextuelles.
      Réponds UNIQUEMENT avec un tableau JSON d'objets.
      Chaque objet doit avoir : "name" (titre) et "description".
      Le format doit être un tableau JSON valide, sans texte avant ni après.
      Exemple : [{"name": "...", "description": "..."}]
    `;

        const response = await queryEngine.query({
            query: promptSystem,
        });

        const content = response.toString();

        // Analyse du JSON
        let tasks;
        try {
            // Nettoyer les blocs de code si du markdown standard est retourné
            const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
            tasks = JSON.parse(cleanContent);

            if (tasks.tasks && Array.isArray(tasks.tasks)) {
                tasks = tasks.tasks;
            }
        } catch (e) {
            console.error("Erreur parsing JSON IA:", e);
            // Fallback : Retourner le texte brut si l'analyse échoue (debug)
            console.log("Raw Content:", content);
            return NextResponse.json({ message: "Format de réponse invalide de l'IA" }, { status: 500 });
        }

        return NextResponse.json(tasks);

    } catch (error: any) {
        console.error("Erreur API Chat (LlamaIndex):", error);
        return NextResponse.json(
            { message: error.message || "Erreur interne" },
            { status: 500 }
        );
    }
}