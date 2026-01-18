"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getStudentFullProfile, type CompetenceLevel } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Stethoscope, ArrowRight, Activity, Zap, Brain, Thermometer, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DomainIcon = ({ name }: { name: string }) => {
  const n = name.toLowerCase();
  if (n.includes("paludisme")) return <Shield className="h-6 w-6 text-emerald-600" />;
  if (n.includes("cardiologie")) return <Activity className="h-6 w-6 text-red-600" />;
  if (n.includes("pneumologie")) return <Thermometer className="h-6 w-6 text-blue-600" />;
  if (n.includes("urgence")) return <Zap className="h-6 w-6 text-amber-600" />;
  if (n.includes("interne")) return <Brain className="h-6 w-6 text-purple-600" />;
  return <Stethoscope className="h-6 w-6 text-slate-600" />;
};

export default function NewConsultationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [competences, setCompetences] = useState<CompetenceLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStudentFullProfile();
        setCompetences(data.competences);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les domaines disponibles.");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const handleSelectDomain = (domainName: string) => {
    // Normalisation simple du slug pour l'URL
    const slug = domainName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Enlever les accents
      .replace(/\s+/g, '-'); // Remplacer les espaces par des tirets
    
    // Générer un ID de session temporaire
    const newSessionId = `SESSION-${Date.now()}`;
    // Passer le nom réel du domaine en paramètre pour l'initialisation backend
    const encodedDomain = encodeURIComponent(domainName);
    router.push(`/learn/${slug}/lesson/${newSessionId}?domain=${encodedDomain}`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle Consultation</h1>
          <p className="text-gray-500">Choisissez un domaine médical pour commencer un cas clinique.</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                {error}
            </div>
        )}

        {competences.length === 0 && !loading && !error ? (
             <div className="text-center py-12">
                <p className="text-gray-500">Aucun domaine de compétence trouvé.</p>
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competences.map((domaine) => (
                <Card 
                    key={domaine.id} 
                    className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500 group"
                    onClick={() => handleSelectDomain(domaine.domaine_nom)}
                >
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                        <DomainIcon name={domaine.domaine_nom} />
                    </div>
                    <div>
                        <CardTitle className="text-lg text-gray-900 group-hover:text-blue-700 transition-colors">
                            {domaine.domaine_nom}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-1 text-xs font-normal">
                            {domaine.niveau_actuel}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 mt-2">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Progression globale</span>
                            <span className="font-medium text-gray-900">{Math.round(domaine.progression_globale)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                                className="bg-blue-600 h-1.5 rounded-full" 
                                style={{ width: `${domaine.progression_globale}%` }}
                            />
                        </div>
                        <div className="pt-2 flex justify-end">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-medium">
                                Commencer <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}
