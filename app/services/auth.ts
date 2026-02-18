// app/services/auth.ts
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"; // Backend Django direct

export const authService = {
  // Fonction de connexion
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        // Vérifie la route exacte de ton backend
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur de connexion");
      }

      const responseData = await response.json();

      // STOCKAGE SÉCURISÉ : On met le token dans un cookie
      // Le backend renvoie { success: true, data: { token: ..., user: ... } }
      if (responseData.data && responseData.data.token) {
        Cookies.set("token", responseData.data.token, {
          expires: 1,
          secure: process.env.NODE_ENV === 'production',
          sameSite: "strict",
        });
        return responseData.data.user; // On retourne les infos utilisateur
      }
    } catch (error) {
      throw error;
    }
  },

  // Fonction d'inscription
  // Dans app/services/auth.ts

  register: async (name: string | undefined, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'inscription");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  getProfile: async () => {
    const token = Cookies.get('token');

    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
        }
        throw new Error('Impossible de récupérer le profil');
      }

      const responseData = await response.json();
      return responseData.data.user;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (data: { name?: string; email?: string; password?: string }) => {
    const token = Cookies.get('token');
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour du profil");
      }

      const responseData = await response.json();
      return responseData.data.user;
    } catch (error) {
      throw error;
    }
  },

  // Fonction de déconnexion
  logout: () => {
    Cookies.remove("token");
    window.location.href = "/login";
  },

  // Récupérer le token (utile pour les autres requêtes)
  getToken: () => {
    return Cookies.get("token");
  },
};
