"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import * as api from '@/lib/api'; // Importe toutes les fonctions de notre service API
import { Loader2 } from 'lucide-react';

// Définition des types pour les données utilisateur et le contexte
interface UserData {
  id: string;
  nom: string;
  email: string;
  matricule?: string; // Optionnel pour les experts
  domaine?: string; // Optionnel pour les experts
  est_profile?: boolean; // Pour les apprenants
}

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  role: 'apprenant' | 'expert' | null;
  isLoading: boolean;
  login: (email: string, password: string, userRole: 'apprenant' | 'expert') => Promise<void>;
  register: (data: any, userRole: 'apprenant' | 'expert') => Promise<void>;
  logout: () => void;
}

// Création du contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Le Provider qui va envelopper notre application
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<'apprenant' | 'expert' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Au premier chargement, on vérifie si l'utilisateur est déjà connecté (via localStorage)
  // ET on applique la redirection de profiling si nécessaire (protection de route simple)
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');
      const storedRole = localStorage.getItem('authRole') as 'apprenant' | 'expert' | null;

      if (storedToken && storedUser && storedRole) {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setRole(storedRole);
        
        // Logique de redirection forcée si 'est_profile' est false
        // On vérifie qu'on n'est PAS DÉJÀ sur la page de profiling pour éviter une boucle
        if (storedRole === 'apprenant' && parsedUser.est_profile === false) {
             const currentPath = window.location.pathname;
             if (currentPath !== '/profiling') {
                 console.log("Utilisateur non profilé détecté, redirection vers /profiling");
                 router.push('/profiling');
             }
        }
      }
    } catch (error) {
      console.error("Erreur de chargement depuis le localStorage", error);
      // En cas d'erreur (ex: JSON malformé), on nettoie
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }, []); // Le tableau de dépendance vide [] fait que cela ne tourne qu'au montage initial


  const handleLoginSuccess = (responseData: any, userRole: 'apprenant' | 'expert') => {
    const userData = userRole === 'apprenant' ? responseData.apprenant : responseData.expert;
    
    setToken(responseData.token);
    setUser(userData);
    setRole(userRole);

    // Stockage dans le localStorage pour la persistance
    localStorage.setItem('authToken', responseData.token);
    localStorage.setItem('authUser', JSON.stringify(userData));
    localStorage.setItem('authRole', userRole);

    // Simplification de la logique de redirection
    if (userRole === 'apprenant') {
      if (userData.est_profile === false) {
          router.push('/profiling');
      } else {
          router.push('/learn');
      }
    } else {
      router.push('/expert/dashboard');
    }
  };

  const login = async (email: string, password: string, userRole: 'apprenant' | 'expert') => {
    let response;
    if (userRole === 'apprenant') {
      response = await api.apprenantLogin({ email, password });
    } else {
      response = await api.expertLogin({ email, password });
    }
    handleLoginSuccess(response, userRole);
  };
  
  const register = async (data: any, userRole: 'apprenant' | 'expert') => {
    if (userRole === 'apprenant') {
      await api.apprenantRegister(data);
    } else {
      await api.expertRegister(data);
    }
  };

  const logout = async () => {
    if (token) {
        try {
            await api.logout(token);
        } catch (error) {
            console.error("Erreur lors de la déconnexion sur le serveur, déconnexion locale forcée.", error);
        }
    }
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('authRole');
    router.push('/'); // Redirige vers la page d'accueil
  };

  const value = { user, token, role, isLoading, login, register, logout };

  // Affiche un loader pendant que l'on vérifie l'état de connexion initial
  if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};