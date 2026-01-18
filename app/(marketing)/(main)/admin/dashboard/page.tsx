"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  UserPlus,
  TrendingUp,
  Activity
} from "lucide-react";
import Link from "next/link";

// Donnees statiques pour le moment (sera remplace par des appels API)
const stats = [
  {
    title: "Total Experts",
    value: "12",
    change: "+2 ce mois",
    icon: Users,
    color: "blue",
  },
  {
    title: "Cas Cliniques",
    value: "1,234",
    change: "+156 cette semaine",
    icon: FileText,
    color: "indigo",
  },
  {
    title: "Cas Valides",
    value: "987",
    change: "80% du total",
    icon: CheckCircle,
    color: "green",
  },
  {
    title: "En Attente",
    value: "42",
    change: "A traiter",
    icon: Clock,
    color: "orange",
  },
];

const recentExperts = [
  { id: 1, nom: "Dr. Jean Kamga", email: "j.kamga@hospital.cm", specialite: "Cardiologie", status: "actif" },
  { id: 2, nom: "Dr. Marie Ngo", email: "m.ngo@hospital.cm", specialite: "Medecine Generale", status: "actif" },
  { id: 3, nom: "Dr. Paul Mbarga", email: "p.mbarga@hospital.cm", specialite: "Urgences", status: "inactif" },
];

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; text: string; icon: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "text-blue-500" },
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600", icon: "text-indigo-500" },
    green: { bg: "bg-green-50", text: "text-green-600", icon: "text-green-500" },
    orange: { bg: "bg-orange-50", text: "text-orange-600", icon: "text-orange-500" },
  };
  return colors[color] || colors.blue;
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-500 mt-1">Bienvenue dans l&apos;espace d&apos;administration</p>
        </div>
        <Link href="/admin/experts/add">
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Ajouter un Expert
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const colors = getColorClasses(stat.color);
          const Icon = stat.icon;

          return (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className={`text-xs mt-2 ${colors.text}`}>{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${colors.bg}`}>
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Experts */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Experts Recents</CardTitle>
            <Link href="/admin/experts">
              <Button variant="ghost" size="sm" className="text-indigo-600">
                Voir tout
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExperts.map((expert) => (
                <div key={expert.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold text-sm">
                        {expert.nom.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{expert.nom}</p>
                      <p className="text-sm text-gray-500">{expert.specialite}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    expert.status === 'actif'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {expert.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/experts/add">
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-colors cursor-pointer">
                  <UserPlus className="h-8 w-8 text-indigo-600 mb-3" />
                  <p className="font-medium text-gray-900">Ajouter Expert</p>
                  <p className="text-sm text-gray-500 mt-1">Creer un nouveau compte expert</p>
                </div>
              </Link>
              <Link href="/admin/cases">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors cursor-pointer">
                  <FileText className="h-8 w-8 text-blue-600 mb-3" />
                  <p className="font-medium text-gray-900">Cas Cliniques</p>
                  <p className="text-sm text-gray-500 mt-1">Gerer les cas cliniques</p>
                </div>
              </Link>
              <Link href="/admin/experts">
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors cursor-pointer">
                  <Users className="h-8 w-8 text-green-600 mb-3" />
                  <p className="font-medium text-gray-900">Liste Experts</p>
                  <p className="text-sm text-gray-500 mt-1">Voir tous les experts</p>
                </div>
              </Link>
              <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-colors cursor-pointer">
                <Activity className="h-8 w-8 text-orange-600 mb-3" />
                <p className="font-medium text-gray-900">Statistiques</p>
                <p className="text-sm text-gray-500 mt-1">Voir les rapports</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
