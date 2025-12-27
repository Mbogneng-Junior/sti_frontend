"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { getSessionsByDomain, startSession, deleteSession } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, PlusCircle, MessageSquare, Clock, MoreVertical, Trash2, CheckCircle, Activity } from "lucide-react";
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
        if (isAuthLoading || !user || !token) return;
        setIsLoading(true);
        getSessionsByDomain(user.id, domaineNom, token)
            .then(setSessions)
            .catch(() => toast.error("Impossible de charger l'historique des sessions."))
            .finally(() => setIsLoading(false));
    }, [isAuthLoading, user, token, domaineNom]);

    const handleStartNewSession = async () => {
        if (!user || !token) return;
        setIsCreating(true);
        try {
            toast.info("Création d'un nouveau cas clinique...");
            const newSession = await startSession(user.email, domaineNom, token);
            router.push(`/learn/${courseId}/lesson/${newSession.session_id}`);
        } catch (error: any) {
            toast.error(`Erreur: ${error.message}`);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteSession = async (sessionId: string) => {
        if (!token) return;
        try {
            await deleteSession(sessionId, token);
            setSessions(prev => prev.filter(s => s.id !== sessionId));
            toast.success("Session supprimée avec succès.");
        } catch (error) {
            toast.error("Erreur lors de la suppression de la session.");
        }
    };

    if (isLoading || isAuthLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
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
                                    <AlertDialog>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="shrink-0 text-slate-400 group-hover:text-slate-600">
                                                    <MoreVertical className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Supprimer
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Êtes-vous sûr de vouloir supprimer cette session ? L'historique de la conversation sera perdu définitivement. Cette action est irréversible.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteSession(session.id)} className="bg-destructive hover:bg-destructive/90">
                                                    Oui, supprimer
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                               </CardContent>
                           </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}