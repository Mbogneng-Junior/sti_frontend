"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  User,
  BookOpen,
  Trophy,
  LogOut,
  Loader2,
  MessageSquare,
} from "lucide-react";

type Props = {
  className?: string;
};

const learnerMenuItems = [
  { label: "Dashboard", href: "/learn", icon: LayoutDashboard },
  { label: "Chat", href: "/chat", icon: MessageSquare },
  { label: "My Profile", href: "/profile", icon: User },
  { label: "Library", href: "/library", icon: BookOpen },
  { label: "Achievements", href: "/achievements", icon: Trophy },
];

export const Sidebar = ({ className }: Props) => {
  const pathname = usePathname();
  const { user, role, logout, isLoading } = useAuth();

  // Si c'est un expert, ne pas afficher cette sidebar
  if (role === 'expert') {
    return null;
  }

  return (
    <div className={cn(
      "flex h-full w-64 fixed left-0 top-0 flex-col bg-white border-r border-gray-100",
      className,
    )}>
      {/* User Profile Section */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 ring-2 ring-blue-100">
            <AvatarImage src="/placeholder-avatar.png" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-lg">
              {user?.nom?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.nom || "Alex Johnson"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              Medical Student &bull; Yr 3
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 space-y-1">
        {learnerMenuItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href === "/learn" && pathname?.startsWith("/learn"));
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-blue-600" : "text-gray-400"
              )} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        {isLoading ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
        ) : user ? (
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 w-full transition-all duration-200 group"
          >
            <LogOut className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" />
            <span>Log Out</span>
          </button>
        ) : null}
      </div>
    </div>
  );
};
