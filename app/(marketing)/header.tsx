"use client";

import { Button } from "@/components/ui/button";
import { Loader, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth"; // Importe notre hook d'authentification personnalisé
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Pour afficher l'initiale de l'utilisateur

export const Header = () => {
    // On récupère l'état et les fonctions de notre contexte d'authentification
    const { user, logout, isLoading } = useAuth();

    return ( 
        <header className="h-20 w-full bg-white shadow-[0_1px_3px_rgb(0,0,0,0.06)] px-6">
            <div className="lg:max-w-7xl mx-auto flex items-center justify-between h-full">
                {/* Section Logo */}
                <Link href="/" className="flex items-center gap-x-3 hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Image src="/Minimal_Geometric_Smirk_Face_Icon.png" height={24} width={24} alt="FultangMed" className="brightness-0 invert"/>
                    </div>
                    <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                        FultangMed
                    </h1>
                </Link>

                {/* Section Authentification */}
                <div className="flex items-center gap-x-4">
                    {isLoading && (
                        <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                    )}
                    {!isLoading && (
                        <>
                            {user ? (
                                // Si l'utilisateur est connecté
                                <div className="flex items-center gap-x-3">
                                    <Avatar className="h-9 w-9">
                                        {/* Affiche la première lettre du nom de l'utilisateur */}
                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                            {user.nom?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium text-slate-600 hidden sm:block">
                                        {user.nom}
                                    </span>
                                    <Button variant="ghost" size="icon" onClick={logout} title="Déconnexion">
                                        <LogOut className="h-5 w-5 text-slate-500" />
                                    </Button>
                                </div>
                            ) : (
                                // Si l'utilisateur n'est pas connecté
                                <Link href="/">
                                    <button className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                                        Connexion
                                    </button>
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
     );
}