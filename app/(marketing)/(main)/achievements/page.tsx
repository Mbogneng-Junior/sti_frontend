"use client";

import { useEffect, useState } from "react";
import { getStudentFullProfile, type FullProfileData } from "@/lib/api";
import { Loader2, Trophy, Medal, Star, Crown, Award, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Liste complète des badges possibles (Mock pour l'affichage des badges verrouillés)
const ALL_BADGES_MOCK = [
  { id: 101, nom: "Premiers Pas", description: "Compléter votre première consultation", icon: "footsteps" },
  { id: 102, nom: "Diagnosticien", description: "Obtenir un score diagnostic > 80% sur 3 cas", icon: "stethoscope" },
  { id: 103, nom: "Expert Paludisme", description: "Maîtriser tous les cas de paludisme", icon: "mosquito" },
  { id: 104, nom: "Communication Top", description: "Score relationnel parfait sur une session", icon: "speech" },
  { id: 105, nom: "Assidu", description: "Se connecter 7 jours d'affilée", icon: "calendar" },
  { id: 106, nom: "Sauveur de Vie", description: "Gérer avec succès une urgence vitale", icon: "heartbeat" },
];

export default function AchievementsPage() {
  const [data, setData] = useState<FullProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentFullProfile()
      .then(setData)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Calcul du niveau (Exemple simple: 1 niveau tous les 500 XP)
  const xp = data?.profil.xp_total || 0;
  const currentLevel = Math.floor(xp / 500) + 1;
  const nextLevelXp = currentLevel * 500;
  const currentLevelProgress = xp % 500;
  const progressPercent = (currentLevelProgress / 500) * 100;

  // Badges débloqués
  const unlockedBadges = data?.profil.badges || [];
  const unlockedIds = new Set(unlockedBadges.map(b => b.id));

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" />
          Succès & Progression
        </h1>
        <p className="text-gray-500 mt-2">
          Suivez votre montée en compétence et débloquez des trophées.
        </p>
      </div>

      {/* Level Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
                    <Crown className="w-12 h-12 text-yellow-300" />
                </div>
                <div className="absolute -bottom-2 w-full text-center">
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full border border-yellow-200">
                        Niv. {currentLevel}
                    </span>
                </div>
            </div>
            
            <div className="flex-1 w-full text-center md:text-left space-y-3">
                <div>
                    <h2 className="text-2xl font-bold">Expertise Médicale</h2>
                    <p className="text-blue-100">Vous êtes sur la bonne voie pour devenir un expert.</p>
                </div>
                
                <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-blue-200">
                        <span>XP Actuel: {xp}</span>
                        <span>Prochain Niveau: {nextLevelXp}</span>
                    </div>
                    <Progress value={progressPercent} className="h-3 bg-blue-900/40" indicatorClassName="bg-yellow-400" />
                </div>
            </div>

            <div className="hidden md:block">
               <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                   <span className="block text-3xl font-black text-yellow-300">{unlockedBadges.length}</span>
                   <span className="text-xs text-blue-100 uppercase font-semibold">Badges Obtenus</span>
               </div>
            </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/30 rounded-full blur-2xl" />
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="col-span-full border-none shadow-none bg-transparent p-0">
             <CardHeader className="px-0 pt-0">
                 <CardTitle className="text-xl flex items-center gap-2">
                     <Medal className="h-5 w-5 text-indigo-600" />
                     Collection de Badges
                 </CardTitle>
             </CardHeader>
          </Card>

          {ALL_BADGES_MOCK.map((badge) => {
              // Check if unlocked dynamically via our mocked list vs real data
              // Note: Using name matching since IDs might not align perfectly with Mock in this demo
              const isUnlocked = unlockedBadges.some(b => b.nom === badge.nom) || unlockedIds.has(badge.id); 

              return (
                <Card key={badge.id} className={`transition-all duration-300 ${isUnlocked ? 'border-yellow-200 bg-yellow-50/30' : 'grayscale opacity-70 border-dashed'}`}>
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                            isUnlocked 
                                ? 'bg-gradient-to-br from-yellow-100 to-amber-200 shadow-inner' 
                                : 'bg-gray-100'
                        }`}>
                            {isUnlocked ? (
                                <Award className="h-8 w-8 text-yellow-600 drop-shadow-sm" />
                            ) : (
                                <Lock className="h-6 w-6 text-gray-400" />
                            )}
                        </div>
                        
                        <div>
                            <h3 className={`font-bold ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>{badge.nom}</h3>
                            <p className="text-xs text-gray-500 mt-1 h-8">{badge.description}</p>
                        </div>

                        {isUnlocked ? (
                             <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                                <Star className="h-3 w-3 fill-yellow-600" /> Débloqué
                             </span>
                        ) : (
                             <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                Verrouillé
                             </span>
                        )}
                    </CardContent>
                </Card>
              );
          })}
      </div>

    </div>
  );
}
