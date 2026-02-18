
import { NextResponse } from 'next/server';

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

        let contextTasks = "";
        if (tachesExistantes && Array.isArray(tachesExistantes) && tachesExistantes.length > 0) {
            contextTasks = "CONTEXTE - Tâches déjà existantes dans le projet :\n" +
                tachesExistantes.map((t: any) => `- ${t.title} (${t.status || 'TODO'})`).join("\n");
        }

        const promptSystem = `
      Tu es un expert en gestion de projet.
      ${contextTasks}

      Génère une liste de NOUVELLES tâches pour répondre à : "${demandeUtilisateur}".
      Ta réponse doit compléter le projet sans créer de doublons avec les tâches existantes.
      Réponds UNIQUEMENT avec un tableau JSON d'objets.
      Chaque objet doit avoir : "name" (titre) et "description".
      Le format doit être un tableau JSON valide, sans texte avant ni après.
      Exemple : [{"name": "...", "description": "..."}]
    `;


        const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "mistral-small-latest",
                messages: [{ role: "user", content: promptSystem }],
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Mistral API Error:", errorText);
            throw new Error(`Erreur API Mistral: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Parsing du JSON
        let tasks;
        try {
            tasks = JSON.parse(content);
            // Si l'IA renvoie un objet { tasks: [...] } au lieu d'un tableau direct
            if (tasks.tasks && Array.isArray(tasks.tasks)) {
                tasks = tasks.tasks;
            }
        } catch (e) {
            console.error("Erreur parsing JSON IA:", e);
            return NextResponse.json({ message: "Format de réponse invalide de l'IA" }, { status: 500 });
        }

        return NextResponse.json(tasks);

    } catch (error: any) {
        console.error("Erreur API Chat:", error);
        return NextResponse.json(
            { message: error.message || "Erreur interne" },
            { status: 500 }
        );
    }
}