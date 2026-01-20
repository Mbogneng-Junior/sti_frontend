"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  UserPlus,
  Activity,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { getStats, getExperts } from "@/lib/api";

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [experts, setExperts] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // On récupère tout en parallèle
        const [statsData, expertsData] = await Promise.all([
          getStats(),
          getExperts()
        ]);
        setStats(statsData);
        setExperts(expertsData);
      } catch (error) {
        console.error("Erreur admin dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-600" />
        <p className="animate-pulse">Synchronisation avec la base de données...</p>
      </div>
    );
  }

  // Calcul des compteurs réels
  const cards = [
    {
      title: "Total Experts",
      value: experts.length.toString(),
      change: "Inscrits",
      icon: Users,
      color: "blue",
    },
    {
      title: "Cas Cliniques",
      value: stats?.total_cas || "0",
      change: "Générés",
      icon: FileText,
      color: "indigo",
    },
    {
      title: "Cas Validés",
      value: stats?.par_status?.PUBLIE || "0",
      change: "En ligne",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "En Attente",
      value: (stats?.par_status?.EN_REVISION || 0) + (stats?.par_status?.BROUILLON_IA || 0),
      change: "À traiter",
      icon: Clock,
      color: "orange",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: any = {
      blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "text-blue-500" },
      indigo: { bg: "bg-indigo-50", text: "text-indigo-600", icon: "text-indigo-500" },
      green: { bg: "bg-green-50", text: "text-green-600", icon: "text-green-500" },
      orange: { bg: "bg-orange-50", text: "text-orange-600", icon: "text-orange-500" },
    };
    return colors[color];
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Espace Administration</h1>
          <p className="text-slate-500">Supervision globale de la plateforme STI</p>
        </div>
        <Link href="/admin/experts/add">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100">
            <UserPlus className="h-4 w-4" /> Ajouter un Expert
          </Button>
        </Link>
      </div>

      {/* Stats Réelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const colors = getColorClasses(card.color);
          return (
            <Card key={index} className="border-0 shadow-sm border-b-2" style={{borderBottomColor: card.color}}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{card.value}</p>
                    <p className={`text-[10px] font-bold mt-2 px-2 py-0.5 rounded-full inline-block ${colors.bg} ${colors.text}`}>
                        {card.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-2xl ${colors.bg}`}>
                    <card.icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des vrais Experts */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Experts Récents</CardTitle>
            <Link href="/admin/experts" className="text-sm text-blue-600 font-semibold hover:underline">Voir tout</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {experts.length === 0 ? (
                <div className="text-center py-10 text-slate-400 italic text-sm">Aucun expert trouvé.</div>
              ) : (
                experts.slice(0, 5).map((expert) => (
                  <div key={expert.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-blue-600">
                        {expert.nom?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{expert.nom}</p>
                        <p className="text-xs text-slate-500">{expert.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-white">
                      {expert.domaine_expertise_nom || "Spécialiste"}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions Systèmes */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Gestion Système</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
              <Link href="/admin/cases" className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-all group">
                <FileText className="h-8 w-8 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-bold text-slate-900">Datasets</p>
                <p className="text-[10px] text-slate-500">Gérer l'extraction</p>
              </Link>
              
              <div 
                onClick={() => alert("Le moteur de génération de cas est actif.")}
                className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-all cursor-pointer group"
              >
                <Activity className="h-8 w-8 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-bold text-slate-900">Moteur IA</p>
                <p className="text-[10px] text-slate-500">Transformer Status</p>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}