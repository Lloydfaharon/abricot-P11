import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
            <div className="mb-6 relative w-64 h-64">
                {/* Placeholder for an illustration if available, else just text for now */}
                <h1 className="text-9xl font-bold text-orange-200">404</h1>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-4">Oups ! Page introuvable</h2>
            <p className="text-gray-500 mt-2 max-w-md">
                Il semblerait que la page que vous cherchez n&apos;existe pas ou a été déplacée.
            </p>

            <Link
                href="/dashboard"
                className="mt-8 px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all hover:scale-105"
            >
                Retour au tableau de bord
            </Link>
        </div>
    );
}
