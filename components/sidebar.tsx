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
            "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col bg-white",
            className,
        )}>
            <Link href={role === 'expert' ? '/expert/dashboard' : '/learn'}>
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                    <Image src="/Minimal_Geometric_Smirk_Face_Icon.png" height={40} width={40} alt="Mascot" />
                    <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
                        Tuteur5GI
                    </h1>
                </div>
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