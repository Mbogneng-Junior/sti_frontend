"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileText,
  Settings,
  LogOut,
  Shield
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  className?: string;
};

const menuItems = [
  { label: "Tableau de bord", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Gestion des Experts", href: "/admin/experts", icon: Users },
  { label: "Ajouter un Expert", href: "/admin/experts/add", icon: UserPlus },
  { label: "Cas Cliniques", href: "/admin/cases", icon: FileText },
  { label: "Parametres", href: "/admin/settings", icon: Settings },
];

export const AdminSidebar = ({ className }: Props) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className={cn(
      "flex h-full w-64 fixed left-0 top-0 flex-col bg-white border-r border-gray-100",
      className,
    )}>
      {/* Logo */}
      <div className="px-6 py-5">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">FultangMed</span>
        </Link>
        <span className="text-xs text-indigo-600 font-medium ml-10">Administration</span>
      </div>

      {/* User Profile */}
      <div className="px-6 py-4 mb-2">
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
          <Avatar className="h-10 w-10 ring-2 ring-indigo-200">
            <AvatarImage src="/placeholder-avatar.png" />
            <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
              {user?.nom?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.nom || "Administrateur"}
            </p>
            <p className="text-xs text-indigo-600 truncate">Super Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 space-y-1">
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
                  ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-indigo-600" : "text-gray-500 group-hover:text-gray-700"
              )} />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 w-full transition-all duration-200 group"
        >
          <LogOut className="h-5 w-5 text-gray-500 group-hover:text-red-500" />
          <span>Deconnexion</span>
        </button>
      </div>
    </div>
  );
};
