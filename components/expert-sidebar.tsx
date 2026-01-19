"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Settings,
  LogOut,
  Library,
  FileText
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  className?: string;
};

// Menu mis à jour selon les exigences du PDF
const menuItems = [
  { 
    label: "Gestion des Cas", 
    href: "/expert/dashboard", 
    icon: LayoutDashboard 
  },
  { 
    label: "Cas en attente", 
    href: "/expert/pending", 
    icon: Clock 
  },
  { 
    label: "Cas Validés", 
    href: "/expert/validated", 
    icon: CheckCircle 
  },
  { 
    label: "Téléchargement des cas", // Libellé exact du PDF
    href: "/expert/library", 
    icon: Library 
  },
  { 
    label: "Paramètres", 
    href: "/expert/settings", 
    icon: Settings 
  },
];

export const ExpertSidebar = ({ className }: Props) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className={cn(
      "flex h-full w-64 fixed left-0 top-0 flex-col bg-white border-r border-gray-200 shadow-sm",
      className,
    )}>
      {/* Logo */}
      <div className="px-6 py-6">
        <Link href="/expert/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-200">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">FultangMed</span>
        </Link>
      </div>

      {/* Profil de l'Expert (Exigence PDF : Montrer l'expert responsable) */}
      <div className="px-4 py-4 mb-4 mx-2 bg-slate-50 rounded-xl border border-slate-100">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
            <AvatarFallback className="bg-blue-600 text-white font-bold">
              {user?.nom?.charAt(0) || "E"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">
              {user?.nom || "Expert Médical"}
            </p>
            <p className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
               Expert Responsable
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 space-y-1">
        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Menu Principal</p>
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          
          return (
            <Link
              key={`${item.label}-${index}`}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group",
                isActive 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
              )}
            >
              <Icon className={cn(
                "h-5 w-5",
                isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"
              )} />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 w-full transition-all duration-200 group"
        >
          <LogOut className="h-5 w-5 text-slate-400 group-hover:text-red-600" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};