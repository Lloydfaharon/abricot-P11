"use client";

import React, { useState, useEffect } from 'react';
import { useData } from '@/app/context/DataContext';
import { authService } from '@/app/services/auth';
import { LogOut } from 'lucide-react';

export default function MonCompte() {
    const { user, refreshData } = useData();

    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (user) {
            // Séparation du nom et prénom
            const parts = (user.name || "").trim().split(' ');
            if (parts.length > 0) {
                setFirstName(parts[0]);
                setLastName(parts.slice(1).join(' ')); // Reste du nom
            }
            setEmail(user.email || "");
        }
    }, [user]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setMessage(null);
        try {
            // Reconstruction du nom complet
            const fullName = `${firstName} ${lastName}`.trim();

            const payload: any = {
                name: fullName,
                email: email
            };

            // Envoi du mot de passe uniquement si modifié
            if (password) {
                payload.password = password;
            }

            await authService.updateProfile(payload);
            await refreshData(); // Rafraîchissement des données
            setMessage({ type: 'success', text: "Informations mises à jour avec succès !" });
            setPassword(""); // Réinitialisation du champ mot de passe
        } catch (error: any) {
            console.error("Erreur mise à jour profil:", error);
            setMessage({ type: 'error', text: error.message || "Erreur lors de la mise à jour." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) return <div className="p-8">Chargement du profil...</div>;

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Mon compte</h1>
                <p className="text-gray-500 mt-1">{user.name}</p>
            </div>

            <div className="space-y-6">
                {/* Prénom */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Prénom</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full h-12 px-4 rounded-md border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-100 placeholder:text-gray-300"
                        placeholder="Votre prénom"
                    />
                </div>

                {/* Nom */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Nom</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full h-12 px-4 rounded-md border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-100 placeholder:text-gray-300"
                        placeholder="Votre nom"
                    />
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-12 px-4 rounded-md border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-100 placeholder:text-gray-300"
                        placeholder="nom@exemple.com"
                    />
                </div>

                {/* Mot de passe */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-12 px-4 rounded-md border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-100 placeholder:text-gray-300 tracking-widest"
                        placeholder="••••••••••••"
                    />
                </div>

                {/* Feedback Message */}
                {message && (
                    <div className={`p-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Bouton */}
                <div className="flex justify-between gap-2 pt-4">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`bg-black text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-gray-800 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? "Enregistrement..." : "Modifier les informations"}
                    </button>
                    <button
                        onClick={authService.logout}
                        className='flex items-center gap-2  rounded-md cursor-pointer hover:text-orange-600 transition-colors'

                    >
                        Se deconnecter
                        <LogOut className="ml-2 h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}