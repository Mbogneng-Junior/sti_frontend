"use client";

import { useEffect, useState } from "react";
import { getStudentFullProfile, type FullProfileData, type CompetenceLevel, type Badge as BadgeType } from "@/lib/api";
import { Loader2, Trophy, Medal, AlertTriangle, TrendingUp, BookOpen, Star, Mail, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  const [data, setData] = useState<FullProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentFullProfile()
      .then(setData)
      .catch((err) => console.error("Erreur profil", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!data) return <div className="p-8 text-center text-red-500">Impossible de charger le profil.</div>;

  const { apprenant, profil, competences } = data;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-8 space-y-8">
      {/* 1. HEADER & IDENTITY */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6">
        <Avatar className="h-24 w-24 ring-4 ring-blue-50">
           <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-3xl font-bold">
            {apprenant.nom.charAt(0)}
           </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 text-center md:text-left space-y-2">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{apprenant.nom}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1 text-gray-500 text-sm">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {apprenant.email}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Inscrit le {new Date(apprenant.date_inscription).toLocaleDateString()}</span>
                </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl flex items-center gap-2 font-medium">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    {profil.xp_total} XP
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl flex items-center gap-2 font-medium">
                    <Star className="h-5 w-5 text-blue-500" />
                    Niveau Global: {competences.length > 0 ? "Intermédiaire" : "Novice"}
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. MAIN COLUMN - COMPETENCES DETAILED */}
        <div className="lg:col-span-2 space-y-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Performance par Domaine
            </h2>

            {competences.length === 0 ? (
                <Card className="bg-white border-dashed">
                    <CardContent className="py-12 text-center text-gray-500">
                        Aucune donnée de compétence pour le moment. Complétez des cas cliniques !
                    </CardContent>
                </Card>
            ) : (
                competences.map((comp) => (
                    <CompetenceCard key={comp.id} data={comp} />
                ))
            )}
        </div>

        {/* 3. RIGHT COLUMN - BADGES & WEAKNESSES */}
        <div className="space-y-8">
            
            {/* BADGES */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Medal className="h-5 w-5 text-yellow-500" /> Badges & Trophées
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {profil.badges && profil.badges.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4">
                            {profil.badges.map((badge: BadgeType) => (
                                <div key={badge.id} className="flex flex-col items-center text-center gap-2 p-2">
                                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                        <Trophy className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-700">{badge.nom}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500 text-center py-4">
                            Aucun badge débloqué pour l&apos;instant.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* LACUNES / FOCUS POINTS */}
            <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <AlertTriangle className="h-5 w-5 text-red-500" /> Points d&apos;Amélioration
                    </CardTitle>
                    <CardDescription>Basé sur vos erreurs récurrentes</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {profil.lacunes_identifiees && profil.lacunes_identifiees.length > 0 ? (
                            profil.lacunes_identifiees.map((lacune, idx) => (
                                <li key={idx} className="flex gap-2 text-sm text-gray-700 bg-red-50 p-2 rounded-md">
                                    <span className="text-red-500 font-bold">•</span>
                                    {typeof lacune === 'string' ? lacune : (
                                        <span className="flex flex-col">
                                            <span className="font-semibold text-xs text-red-700 uppercase">{lacune.competence}</span>
                                            <span>{lacune.feedback}</span>
                                        </span>
                                    )}
                                </li>
                            ))
                        ) : (
                            <li className="text-sm text-gray-500 italic">Aucune lacune majeure détectée.</li>
                        )}
                    </ul>
                </CardContent>
            </Card>

        </div>
      </div>
    </div>
  );
}

const CompetenceCard = ({ data }: { data: CompetenceLevel }) => {
    return (
        <Card className="overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white rounded-lg border shadow-sm flex items-center justify-center text-blue-600">
                        <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{data.domaine_nom}</h3>
                        <p className="text-xs text-gray-500">Niveau actuel: <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{data.niveau_actuel}</span></p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">{Math.round(data.progression_globale)}%</span>
                    <span className="text-xs text-gray-500 block">Maîtrise</span>
                </div>
            </div>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <SkillBar label="Anamnèse & Interrogatoire" value={data.score_anamnese} color="bg-blue-500" />
                <SkillBar label="Raisonnement Diagnostique" value={data.score_diagnostic} color="bg-purple-500" />
                <SkillBar label="Traitement & Prise en charge" value={data.score_traitement} color="bg-green-500" />
                <SkillBar label="Communication & Relationnel" value={data.score_relationnel} color="bg-amber-500" />
            </CardContent>
        </Card>
    );
};

const SkillBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="space-y-1">
        <div className="flex justify-between text-sm">
            <span className="text-gray-600">{label}</span>
            <span className="font-medium text-gray-900">{Math.round(value)}%</span>
        </div>
        <Progress value={value} className="h-2" indicatorClassName={color} />
    </div>
);
