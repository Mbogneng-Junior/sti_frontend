"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { SidebarItem } from "./sidebar-item";
import { useAuth } from "@/hooks/useAuth"; // On importe le hook
import { Button } from "./ui/button";
import { Loader, LogOut } from "lucide-react";

type Props = {
    className?: string;
};

export const Sidebar = ({ className }: Props) => {
    const { user, role, logout, isLoading } = useAuth(); // On récupère les infos d'auth

    return (
        <div className={cn(
            "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 flex-col bg-white shadow-[2px_0_15px_rgb(0,0,0,0.06)]",
            className,
        )}>
            <Link href={role === 'expert' ? '/expert/dashboard' : '/learn'} className="pt-8 pl-4 pb-7 flex items-center gap-x-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Image src="/Minimal_Geometric_Smirk_Face_Icon.png" height={24} width={24} alt="FultangMed" className="brightness-0 invert" />
                </div>
                <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                    FultangMed
                </h1>
            </Link>

            <div className="flex flex-col gap-y-2 flex-1">
                {/* Liens conditionnels en fonction du rôle */}
                {role === 'apprenant' && (
                    <>
                        <SidebarItem label="Apprendre" href="/learn" iconSrc="/learn.png" />
                        <SidebarItem label="Classement" href="/leaderboard" iconSrc="/globe.svg" />
                        <SidebarItem label="Quêtes" href="/quests" iconSrc="/target.png" />
                        <SidebarItem label="Shop" href="/shop" iconSrc="/shop.png" />
                    </>
                )}
                {role === 'expert' && (
                    <>
                        <SidebarItem label="Dashboard" href="/expert/dashboard" iconSrc="/file.svg" />
                        <SidebarItem label="Bibliothèque" href="/expert/library" iconSrc="/globe.svg" />
                        <SidebarItem label="Mon Profil" href="/expert/profile" iconSrc="/learn.png" />
                    </>
                )}
            </div>
            
            <div className="p-4">
                {isLoading ? (
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                ) : user ? (
                    <div className="flex items-center gap-x-3">
                        <Button variant="ghost" onClick={logout} className="w-full justify-start">
                            <LogOut className="h-5 w-5 mr-4"/>
                            Déconnexion
                        </Button>
                    </div>
                ) : null}
            </div>
        </div>
    );
};