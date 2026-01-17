"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, PlusCircle, MessageSquare, Clock, CheckCircle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Structure de données pour les cours (pour l'image)
const COURSES_DATA: Record<string, { image: string }> = {
  "paludisme": { image: "/paludisme.png" },
  "diabète": { image: "/diabete.png" },
  "avc": { image: "/avc.png" },
  "cancer du col": { image: "/cervical_cancer.png" },
};

// Type pour les données de session enrichies
interface SessionData {
    id: string;
    date_debut: string;
    date_fin: string | null; // Pour savoir si la session est terminée
    interaction_count: number;
    score_session: number;
    cas_clinique: {
        titre: string;
    };
}

export default function CourseSessionsPage() {
    const router = useRouter();
    const params = useParams();
    const { user, token, isLoading: isAuthLoading } = useAuth();
    
    const courseId = params.courseId as string;
    const domaineNom = courseId.charAt(0).toUpperCase() + courseId.slice(1);
    const courseImage = COURSES_DATA[courseId.toLowerCase()]?.image || "/learn.png";

    const [sessions, setSessions] = useState<SessionData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        // Attendre que l'authentification soit chargée
        if (isAuthLoading) {
            return;
        }

        // Si pas d'utilisateur après le chargement, on ne fait rien ici
        // Le rendu conditionnel plus bas gèrera l'affichage
        if (!user) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const mockSessions: SessionData[] = [
            {
                id: 'SESSION-1',
                date_debut: new Date().toISOString(),
                date_fin: null,
                interaction_count: 5,
                score_session: 0,
                cas_clinique: {
                    titre: 'Cas de Paludisme Simple',
                },
            },
            {
                id: 'SESSION-2',
                date_debut: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                date_fin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
                interaction_count: 15,
                score_session: 85,
                cas_clinique: {
                    titre: 'Cas de Paludisme Sévère',
                },
            },
        ];
        setSessions(mockSessions);
        setIsLoading(false);
    }, [courseId, isAuthLoading, user, router]);

    const handleStartNewSession = async () => {
        if (!user) {
            toast.error("Vous devez être connecté pour démarrer une session.");
            return;
        }
        setIsCreating(true);
        toast.info("Création d'un nouveau cas clinique simulé...");

        // Simulation d'un appel API
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newSessionId = `SESSION-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        setIsCreating(false);
        router.push(`/learn/${courseId}/lesson/${newSessionId}`);
    };

    if (isLoading || isAuthLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }
    
    // Si l'utilisateur n'est pas authentifié après le chargement, on peut afficher un message
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-slate-600">Vous devez être connecté pour voir cette page.</p>
                <Link href="/">
                    <Button>Se connecter</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* --- En-tête amélioré --- */}
            <div className="flex items-center gap-6 mb-8">
                <div className="bg-white p-3 rounded-2xl border-2 shadow-sm">
                    <Image src={courseImage} alt={domaineNom} width={60} height={60} />
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 tracking-tight">{domaineNom}</h1>
                    <p className="text-slate-500 mt-1">Reprenez une conversation ou démarrez un nouveau cas clinique.</p>
                </div>
            </div>

            {/* --- Bouton d'action principal --- */}
            <Button onClick={handleStartNewSession} disabled={isCreating} size="lg" className="w-full h-16 text-lg mb-12 gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {isCreating ? <Loader2 className="h-6 w-6 animate-spin" /> : <PlusCircle className="h-6 w-6" />}
                {isCreating ? "Génération du cas..." : "Démarrer une Nouvelle Session"}
            </Button>

            {/* --- Section Historique --- */}
            <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-neutral-700 border-b-2 pb-3">Historique des Sessions</h2>

                {sessions.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed">
                        <MessageSquare className="mx-auto h-12 w-12 text-slate-300" />
                        <h3 className="mt-4 text-lg font-medium text-slate-700">Aucun historique</h3>
                        <p className="mt-1 text-sm text-slate-500">Votre première session pour ce domaine apparaîtra ici.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sessions.map((session) => (
                           <Card key={session.id} className="group transition-shadow duration-300 hover:shadow-lg">
                               <CardContent className="p-4 flex items-center justify-between gap-4">
                                    <Link href={`/learn/${courseId}/lesson/${session.id}`} className="flex-1 flex items-center gap-4">
                                        <div className={`p-3 rounded-lg ${session.date_fin ? 'bg-green-100' : 'bg-blue-100'}`}>
                                            {session.date_fin ? <CheckCircle className="h-6 w-6 text-green-600"/> : <Activity className="h-6 w-6 text-blue-600"/>}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-800 group-hover:text-primary transition-colors">
                                                {session.cas_clinique?.titre || `Session #${session.id.substring(0, 8)}`}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                                <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" />
                                                    {new Date(session.date_debut).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className="flex items-center gap-1.5"><MessageSquare className="h-3 w-3" />
                                                    {session.interaction_count} messages
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                               </CardContent>
                           </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}