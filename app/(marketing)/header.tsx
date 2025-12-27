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
        <header className="h-20 w-full border-b-2 border-slate-200 px-4 bg-white">
            <div className="lg:max-w-5xl mx-auto flex items-center justify-between h-full">
                {/* Section Logo (inchangée) */}
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                    <Image src="/Minimal_Geometric_Smirk_Face_Icon.png" height={40} width={40} alt="Mascot"/>
                    <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
                        Tuteur5GI
                    </h1>
                </div>

                {/* Section Authentification (entièrement remplacée) */}
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
                                <Button size="lg" variant="ghost" asChild>
                                    <Link href="/">
                                        Login
                                    </Link>
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
     );
}