// app/profile/page.tsx
'use client';
import InterfacesTdB from '../components/interfacestdb/InterfacesTdB';
import { useData } from '../context/DataContext';
import { useState } from 'react';
import Modal from '../components/modal/Modal';
import ModalCreerProjet from '../components/modal/ModalCreerProjet';

export default function ProfilePage() {
  const { user, loading } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);


  if (loading) return <div className="p-10">Chargement...</div>;

  return (
    <div className="">
      <div className="flex flex-col pt-10 md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <div className="text-gray-500 text-sm md:text-base">
            Bonjour <span className="font-medium text-gray-900">{user?.name || "Invité"}</span>, voici un aperçu de vos projets et tâches
          </div>
        </div>

        <div className="w-full md:w-auto shrink-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all w-full md:w-46.25 h-13 shadow-sm active:scale-95 flex items-center justify-center"
          >
            + Créer un projet
          </button>
        </div>
      </div>
      <InterfacesTdB />


      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Créer un projet"
      >
        <ModalCreerProjet onClose={() => setIsModalOpen(false)} />
      </Modal>

    </div>

  );
}