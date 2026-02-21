# Gestionnaire de Projets (Abricot) - Frontend

Bienvenue sur le front-end du Gestionnaire de Projets Abricot, développé avec Next.js 14, React, TailwindCSS et l'intégration de Mistral AI.

## Prérequis

Avant de lancer ce projet, assurez-vous d'avoir :
- Node.js installé sur votre machine.
- Le Backend Django (ou Node.js) fonctionnel et en cours d'exécution sur votre machine (par défaut sur `http://localhost:8000`).

## Installation et Configuration (Important pour l'audit)

1. Installez les dépendances du projet :
```bash
npm install
```

2. **Configuration de l'environnement :**
Afin d'assurer le lien avec le backend et l'API IA de Mistral, copiez le fichier d'exemple pour créer votre propre fichier `.env.local` :

```bash
cp .env.example .env.local
```

Ouvrez ce fichier `.env.local` et vérifiez les valeurs :
- `NEXT_PUBLIC_API_URL=/api` *(Laissez cette valeur telle quelle, elle active notre proxy Next.js interne qui résout les erreurs CORS)*.
- `API_BACKEND_URL=http://localhost:8000` *(Modifiez ce port si votre backend ne tourne pas sur le port 8000)*.
- `MISTRAL_API_KEY=xxx` *(Insérez votre clé API Mistral pour tester la fonctionnalité de génération de tâches).*

## Lancement du projet

Une fois l'installation et la configuration terminées, lancez le serveur de développement :

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

## Architecture & Choix Techniques
- **Sécurité et CORS** : L'authentification utilise Next.js Rewrites. Le front-end requête systématiquement le chemin local `/api`, et Next.js redirige ces appels côté serveur de manière transparente vers le backend (configuré via `API_BACKEND_URL`).
- **Protection des API tierces** : L'endpoint `/api/chat` appelé par le dashboard pour l'Intelligence Artificielle est protégé par une double vérification JWT auprès du backend pour éviter tout abus de facturation Mistral par un visiteur non identifié.
