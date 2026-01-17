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
  LogOut
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  className?: string;
};

const menuItems = [
  { label: "Tableau de bord", href: "/expert/dashboard", icon: LayoutDashboard },
  { label: "Cas en attente", href: "/expert/pending", icon: Clock, badge: 42 },
  { label: "Validés", href: "/expert/validated", icon: CheckCircle },
  { label: "Rejetés", href: "/expert/rejected", icon: XCircle },
  { label: "Paramètres", href: "/expert/settings", icon: Settings },
];

export const ExpertSidebar = ({ className }: Props) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className={cn(
      "flex h-full w-64 fixed left-0 top-0 flex-col bg-white",
      className,
    )}>
      {/* Logo */}
      <div className="px-6 py-5">
        <Link href="/expert/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">FultangMed</span>
        </Link>
      </div>

      {/* User Profile */}
      <div className="px-6 py-4 mb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-avatar.png" />
            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
              {user?.nom?.charAt(0) || "DS"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.nom || "Dr. Sarah Smith"}
            </p>
            <p className="text-xs text-gray-500 truncate">Expert Tuteur Senior</p>
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
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
              )} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 w-full transition-all duration-200 group"
        >
          <LogOut className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};
