// app/profile/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { authService } from '@/app/services/auth';
import InterfacestdB from '../components/interfacestdb/interfacestdb';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Au chargement de la page, on va chercher les infos
    const fetchUser = async () => {
      try {
        const userData = await authService.getProfile();
        setUser(userData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  if (!user) return <div className="p-10">Chargement...</div>;

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div className="py-25 flex flex-col gap14px">
          <h1 className="text-3xl ">Tableau de bord</h1>

          <div className="  rounded-lg ">
            <p className="text-gray-600">Bonjour <span >{user.name}</span>, voici un aperçu de vos projets et tâches</p>
          </div>
        </div>
        <div>
          <button className="bg-black text-white rounded-[10px] hover:bg-gray-800 transition-colors w-45.25 h-12.5 ">
            + Créer un projet
          </button>
        </div>
      </div>
      <InterfacestdB />

      <button
        onClick={authService.logout}
        className="mt-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors w-50 "
      >
        Se déconnecter
      </button>
    </div>
  );
}