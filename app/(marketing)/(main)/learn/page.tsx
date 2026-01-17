"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  ChevronRight,
  Loader2,
  TrendingUp,
  Clock,
  Target,
  Zap,
  MessageSquare,
  CheckCircle,
  Activity
} from "lucide-react";

// Données simulées pour le profil de compétences
const PROFICIENCY_DATA = [
  {
    id: "clinical_knowledge",
    label: "Connaissances Cliniques",
    value: 85,
    color: "from-red-500 to-rose-500",
    bgColor: "bg-red-50",
    description: "Maîtrise avancée des concepts fondamentaux"
  },
  {
    id: "differential_diagnosis",
    label: "Diagnostic Différentiel",
    value: 64,
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50",
    description: "Niveau intermédiaire, nécessite plus de pratique"
  },
  {
    id: "communication_skills",
    label: "Communication",
    value: 72,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    description: "En progression, focus sur le rapport patient"
  },
  {
    id: "empathy_ethics",
    label: "Empathie & Éthique",
    value: 91,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    description: "Excellent focus patient"
  }
];

// Données simulées pour les sessions/consultations
const SESSIONS_DATA = [
  {
    id: "SESSION-1",
    date: "24 Jan 2026",
    time: "14:30",
    domain: "Paludisme",
    caseTitle: "Cas de Paludisme Simple",
    messageCount: 12,
    isCompleted: false,
    score: null
  },
  {
    id: "SESSION-2",
    date: "21 Jan 2026",
    time: "09:15",
    domain: "Paludisme",
    caseTitle: "Cas de Paludisme Sévère",
    messageCount: 24,
    isCompleted: true,
    score: 85
  },
  {
    id: "SESSION-3",
    date: "18 Jan 2026",
    time: "11:00",
    domain: "Diabète",
    caseTitle: "Diabète Type 2 - Complications",
    messageCount: 18,
    isCompleted: true,
    score: 92
  }
];

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

  // Démarrer une nouvelle consultation - va directement au chat
  const handleStartConsultation = () => {
    setIsStarting(true);
    const newSessionId = `SESSION-${Date.now()}`;
    router.push(`/learn/paludisme/lesson/${newSessionId}`);
  };

  // Reprendre une session existante
  const handleResumeSession = (sessionId: string, domain: string) => {
    router.push(`/learn/${domain.toLowerCase()}/lesson/${sessionId}`);
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
            <Button
              onClick={handleStartConsultation}
              disabled={isStarting}
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-semibold shadow-lg shadow-blue-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98]"
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
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">12</p>
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
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">78%</p>
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
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">4.2h</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">Temps d'Étude</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">5</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">Jours Consécutifs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mes Sessions / Consultations */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="px-4 sm:px-6 pb-3 sm:pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2 sm:gap-3">
                <div className="w-1 sm:w-1.5 h-6 sm:h-7 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
                Mes Sessions
              </CardTitle>
              <span className="text-xs sm:text-sm text-gray-500">{SESSIONS_DATA.length} session(s)</span>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {SESSIONS_DATA.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-slate-50 rounded-xl sm:rounded-2xl border-2 border-dashed">
                <MessageSquare className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-slate-300" />
                <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-slate-700">Aucune session</h3>
                <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-500 px-4">Démarrez votre première consultation pour commencer.</p>
                <Button
                  onClick={handleStartConsultation}
                  className="mt-4 sm:mt-6 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Nouvelle Consultation
                </Button>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {SESSIONS_DATA.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => handleResumeSession(session.id, session.domain)}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gray-50 hover:bg-blue-50 cursor-pointer transition-all group border border-transparent hover:border-blue-200"
                  >
                    {/* Top row on mobile: Icon + Title + Status */}
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
                      {/* Status Icon */}
                      <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0 ${session.isCompleted ? 'bg-green-100' : 'bg-blue-100'}`}>
                        {session.isCompleted ? (
                          <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                        ) : (
                          <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                        )}
                      </div>

                      {/* Session Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {session.caseTitle}
                          </p>
                          {!session.isCompleted && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full whitespace-nowrap">
                              En cours
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden xs:inline">{session.date} à</span> {session.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                            {session.messageCount} msg
                          </span>
                          <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs font-medium rounded-full">
                            {session.domain}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Score or Continue */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200">
                      {session.isCompleted && session.score !== null ? (
                        <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold ${
                          session.score >= 90
                            ? 'bg-green-100 text-green-700'
                            : session.score >= 70
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                        }`}>
                          {session.score}/100
                        </span>
                      ) : (
                        <span className="text-sm text-blue-600 font-medium group-hover:underline">
                          Continuer
                        </span>
                      )}
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Proficiency Profile */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="px-4 sm:px-6 pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2 sm:gap-3">
              <div className="w-1 sm:w-1.5 h-6 sm:h-7 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
              Profil de Compétences
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
              {PROFICIENCY_DATA.map((item) => (
                <ProficiencyBar
                  key={item.id}
                  label={item.label}
                  value={item.value}
                  color={item.color}
                  bgColor={item.bgColor}
                  description={item.description}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
