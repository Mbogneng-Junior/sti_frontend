"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Loader2,
  TrendingUp,
  Clock,
  Target,
  Zap,
  MessageSquare,
} from "lucide-react";
import { getStudentDashboardStats, type StudentDashboardData } from "@/lib/api";

const ProficiencyBar = ({
  label,
  value,
  color,
  bgColor,
  description
}: {
  label: string;
  value: number;
  color: string;
  bgColor: string;
  description: string;
}) => (
  <div className={`${bgColor} rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-2 sm:space-y-3`}>
    <div className="flex items-center justify-between">
      <span className="text-sm sm:text-base font-semibold text-gray-800">{label}</span>
      <span className={`text-sm sm:text-base font-bold ${
        value >= 80 ? 'text-green-600' : value >= 60 ? 'text-amber-600' : 'text-red-600'
      }`}>
        {value}%
      </span>
    </div>
    <div className="h-2 sm:h-3 bg-white/60 rounded-full overflow-hidden shadow-inner">
      <div
        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${value}%` }}
      />
    </div>
    <p className="text-xs sm:text-sm text-gray-600">{description}</p>
  </div>
);

export default function LearnDashboardPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isStarting, setIsStarting] = useState(false);
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);

  useEffect(() => {
    const loadStats = async () => {
        try {
            const data = await getStudentDashboardStats();
            setDashboardData(data);
        } catch (e) {
            console.error(e);
        }
    };
    if (user) loadStats();
  }, [user]);

  // Démarrer une nouvelle consultation - va directement au chat
  const handleStartConsultation = () => {
    router.push(`/learn/new`);
  };

  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-blue-600" />
          <p className="text-sm sm:text-base text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 sm:gap-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-8">
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Bienvenue sur FultangMed</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-md px-4">
            Connectez-vous pour accéder à votre tableau de bord et commencer votre apprentissage médical.
          </p>
        </div>
        <Link href="/">
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-medium shadow-lg">
            Se connecter
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tableau de Bord</h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2 truncate">
                Bienvenue, <span className="font-medium text-gray-700">{user?.nom || 'Apprenant'}</span>
              </p>
            </div>
            <div className="flex gap-3">
                <Button
                onClick={() => router.push('/chat')}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm"
                >
                <MessageSquare className="h-5 w-5 mr-2" />
                Mes Discussions
                </Button>
                <Button
                onClick={handleStartConsultation}
                disabled={isStarting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white shadow-lg"
                >
                {isStarting ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                    <Plus className="h-5 w-5 mr-2" />
                )}
                Nouvelle Consultation
                </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{dashboardData?.global_stats.cas_completes || 0}</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">Cas Complétés</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{dashboardData?.global_stats.score_moyen || 0}%</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">Score Moyen</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{dashboardData?.global_stats.temps_etude || 0}h</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">Temps d&apos;Étude</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{dashboardData?.global_stats.jours_consecutifs || 0}</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">Jours Consécutifs</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Proficiency Profile */}
            <Card className="border-0 shadow-sm bg-white h-full">
            <CardHeader className="px-4 sm:px-6 pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2 sm:gap-3">
                <div className="w-1 sm:w-1.5 h-6 sm:h-7 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
                Profil de Compétences
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
                <div className="space-y-4">
                {dashboardData?.proficiency_data.map((item) => (
                    <ProficiencyBar
                    key={item.id}
                    label={item.label}
                    value={item.value}
                    color={item.color}
                    bgColor={item.bgColor}
                    description={item.description}
                    />
                ))}
                {!dashboardData && (
                    <div className="text-center text-gray-500 py-10">Chargement des données...</div>
                )}
                </div>
            </CardContent>
            </Card>

            {/* Difficulties */}
             <Card className="border-0 shadow-sm bg-white h-full">
                <CardHeader className="px-4 sm:px-6 pb-3 sm:pb-4">
                    <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2 sm:gap-3">
                    <div className="w-1 sm:w-1.5 h-6 sm:h-7 bg-gradient-to-b from-orange-500 to-red-600 rounded-full" />
                    Difficultés Récemment Identifiées
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                    {dashboardData?.difficulties && dashboardData.difficulties.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                             {dashboardData.difficulties.map((diff, i) => (
                                <div key={i} className="flex items-start gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm border border-red-100">
                                   <div className="mt-0.5 shrink-0 w-2 h-2 rounded-full bg-red-400" />
                                   {diff}
                                </div>
                             ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <Target className="w-12 h-12 mb-3 opacity-20" />
                            <p>Aucune difficulté majeure récente.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
