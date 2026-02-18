// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/app/components/authlayout/AuthLayout';
import { authService } from '@/app/services/auth'; // Importe ton service
import { useData } from '@/app/context/DataContext';

export default function LoginPage() {
  const router = useRouter();
  const { refreshData } = useData();

  // États pour stocker les saisies
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Appel au backend via notre service
      await authService.login(email, password);

      // On rafraîchit les données du contexte
      await refreshData();

      // Si ça marche, on redirige vers le dashboard ou le profil
      router.push('/dashboard');
    } catch (err: any) {
      // Gestion d'erreur (ex: mauvais mot de passe)
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Connexion"
      imageSrc="/images/login.png"
      bottomText="Pas encore de compte ?"
      linkText="Créer un compte"
      linkUrl="/register"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 ml-1">Email</label>
          <input
            aria-label='email'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#E85D04] transition-all"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 ml-1">Mot de passe</label>
          <input
            aria-label='password'
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#E85D04] transition-all"
          />
        </div>

        <button className="bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors mt-2">
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </button>

        <div className="text-center">
          <a href="#" className="text-xs text-[#E85D04] hover:underline">Mot de passe oublié ?</a>
        </div>
      </form>
    </AuthLayout>
  );
}