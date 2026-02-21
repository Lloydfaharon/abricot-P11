// app/(auth)/register/page.tsx
'use client'; // ⚠️ Indispensable pour utiliser useState et useRouter

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/app/components/authlayout/AuthLayout';
import { authService } from '@/app/services/auth'; // Assure-toi que le chemin est bon

export default function RegisterPage() {
  const router = useRouter();

  // 1. Les états pour stocker ce que l'utilisateur tape
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // États pour gérer le chargement et les erreurs
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 2. La fonction qui se lance quand on clique sur "S'inscrire"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche la page de se recharger
    setError(null);
    setIsLoading(true);

    try {
      // On appelle le backend
      // On passe une chaîne vide pour le nom car il est optionnel mais attendu par la signature
      await authService.register("", email, password);

      // Si tout se passe bien, on redirige vers le login 
      // (ou directement vers le dashboard si ton API connecte l'utilisateur auto)
      router.push('/login');
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Inscription"
      imageSrc="/images/signin.png"
      bottomText="Déjà inscrit ?"
      linkText="Se connecter"
      linkUrl="/login"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Affichage des erreurs en rouge si besoin */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1 shrink-0">
          <label htmlFor="email" className="text-xs font-bold text-gray-500 ml-1">Email</label>
          <input
            aria-label='email'
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-13 px-4 border border-gray-200 bg-white rounded-lg outline-none focus:ring-2 focus:ring-[#E85D04] transition-all"
          />
        </div>

        <div className="flex flex-col gap-1 shrink-0">
          <label htmlFor="password" className="text-xs font-bold text-gray-500 ml-1">Mot de passe</label>
          <input
            aria-label='password'
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // J'ai uniformisé en rounded-lg pour que ce soit joli comme l'email
            className="w-full h-13 px-4 border border-gray-200 bg-white rounded-lg outline-none focus:ring-2 focus:ring-[#E85D04] transition-all"
          />
          <p className="text-xs text-gray-500 ml-1">
            Min. 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre.
          </p>
        </div>

        <button
          disabled={isLoading}
          className="bg-black shrink-0 h-13 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors mx-3 mt-2 disabled:opacity-50"
        >
          {isLoading ? 'Inscription en cours...' : "S'inscrire"}
        </button>
      </form>
    </AuthLayout>
  );
}