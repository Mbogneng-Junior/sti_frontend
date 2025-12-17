// import { cn } from "@/lib/utils";
// import Image from "next/image";
// import Link from "next/link";
// import { SidebarItem } from "./sidebar-item";

// type Props = {
//      className?: string;
//  };

//  export const Sidebar = ({ className }: Props) => {
//      return (
//          <div className={cn(
//              "flex  h-full lg:w-64 lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
//              className,
//              )}>
//                  <Link href="/learn" className="absolute top-4 left-4">
//                      <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
//                          <Image src="/Minimal_Geometric_Smirk_Face_Icon.png" height={40} width={40} alt="Mascot"/>
//                          <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
//                              Tuteur5GI
//                          </h1>
//                      </div>
//                  </Link>
//                  <div className="flex flex-col gap-y-2 flex-1">
//                      <SidebarItem 
//                          label="Learn"
//                          href="/learn"
//                          iconSrc="/learn.svg"
//                      />
//                  </div>
//          </div>
//      );
//  };




import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { SidebarItem } from "./sidebar-item";

type Props = {
    className?: string;
};

export const Sidebar = ({ className }: Props) => {
    return (
        <div className={cn(
            "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col bg-white", // Ajout de bg-white
            className,
        )}>
            {/* Le Link n'est plus en absolute, on gère l'espacement avec du padding */}
            <Link href="/learn">
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                    {/* Vérifie bien l'extension : .png ou .svg ? Ton arborescence dit .png */}
                    <Image src="/Minimal_Geometric_Smirk_Face_Icon.png" height={40} width={40} alt="Mascot" />
                    <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
                        Tuteur5GI
                    </h1>
                </div>
            </Link>

            <div className="flex flex-col gap-y-2 flex-1">
                <SidebarItem
                    label="Apprendre"
                    href="/learn"
                    iconSrc="/learn.png" // Assure-toi que c'est le bon nom (png vs svg)
                />
                <SidebarItem
                    label="Classement"
                    href="/leaderboard"
                    iconSrc="/globe.svg" 
                />
                <SidebarItem
                    label="Quêtes"
                    href="/quests"
                    iconSrc="/target.svg" // Remplace par une icône existante
                />
            </div>
            
            {/* Optionnel : Bouton de déconnexion ou profil en bas */}
            <div className="p-4">
            </div>
        </div>
    );
};



