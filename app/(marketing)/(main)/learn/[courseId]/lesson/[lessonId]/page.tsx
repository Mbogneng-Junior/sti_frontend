"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Stethoscope, User, GraduationCap, Loader2, Sparkles, BarChart, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth"; // Importe le hook d'authentification

// Importe les fonctions API qui communiquent avec le backend
import { startSession, analyseResponse, getSessionState } from "@/lib/api";

// Définition des types pour une meilleure autocomplétion et sécurité du code
type Role = "doctor" | "patient" | "tutor" | "system";
interface Message {
  person: Role;
  message: string;
}
interface StudentProfile {
  score_global: number;
  competences: Record<string, number>;
  feedbacks: { competence: string; points: number; message: string }[];
  lacunes: any[];
}

// Sous-composant pour afficher la barre latérale du profil étudiant
const StudentProfileSidebar = ({ profile }: { profile: StudentProfile | null }) => {
    if (!profile) {
        return (
            <div className="hidden lg:flex flex-col w-[350px] p-4 bg-slate-50 border-l-2 items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                <p className="text-sm text-slate-500 mt-2">Chargement du profil...</p>
            </div>
        );
    }

    return (
        <div className="hidden lg:flex flex-col w-[350px] p-4 bg-slate-50 border-l-2 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><User className="h-5 w-5 text-primary"/> Profil Étudiant</h3>
            <div className="space-y-4">
                <div className="bg-white p-3 rounded-lg border">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">XP Global</p>
                    <p className="text-2xl font-bold flex items-center gap-2 mt-1">
                        <Sparkles className="h-5 w-5 text-yellow-500"/> {profile.score_global ?? 0}
                    </p>
                </div>
                
                <div className="bg-white p-3 rounded-lg border">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><BarChart className="h-4 w-4"/> Compétences</h4>
                    <ul className="space-y-1 text-sm">
                        {Object.keys(profile.competences || {}).length > 0 ? Object.entries(profile.competences).map(([key, value]) => (
                            <li key={key} className="flex justify-between items-center">
                                <span className="capitalize text-slate-600">{key}:</span>
                                <span className="font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-800">{value}</span>
                            </li>
                        )) : <p className="text-xs text-slate-400 italic">Aucun score pour l'instant.</p>}
                    </ul>
                </div>
                
                <div className="bg-white p-3 rounded-lg border">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4"/> Feedbacks Récents</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {(profile.feedbacks || []).slice(-5).reverse().map((fb, i) => (
                            <div key={i} className="text-xs p-2 bg-slate-100/70 rounded border">
                                <p className={`font-bold ${fb.points > 0 ? 'text-green-600' : 'text-red-600'}`}>{fb.competence} ({fb.points > 0 ? '+' : ''}{fb.points} pts)</p>
                                <p className="text-slate-600">{fb.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Composant principal de la page de chat
export default function LessonChatPage() {
    const params = useParams();
    const router = useRouter();
    const { user, token, isLoading: isAuthLoading, role } = useAuth();

    const domaineNom = (params.courseId as string).charAt(0).toUpperCase() + (params.courseId as string).slice(1);
    
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState("Authentification...");

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);

    const bottomRef = useRef<HTMLDivElement>(null);

    // Effet pour initialiser la session
    useEffect(() => {
        if (isAuthLoading) return; // Attendre que l'authentification soit vérifiée

        if (!user || !token || role !== 'apprenant') {
            router.push('/'); // Rediriger si non connecté ou si ce n'est pas un apprenant
            return;
        }

        const initSession = async () => {
            try {
                setLoadingMessage("Démarrage de la session de formation...");
                const sessionData = await startSession(user.email, domaineNom, token);
                setSessionId(sessionData.session_id);

                setLoadingMessage("Le patient virtuel se prépare...");
                const state = await getSessionState(sessionData.session_id, token);
                
                setMessages(state.chat_history || []);
                setStudentProfile(state.student_profile || null);

            } catch (error) {
                console.error("Erreur d'initialisation de la session:", error);
                setMessages([{ person: "system", message: `Erreur critique : ${error instanceof Error ? error.message : "Impossible de démarrer la session."}` }]);
            } finally {
                setIsLoading(false);
            }
        };

        initSession();
    }, [isAuthLoading, user, token, role, domaineNom, router]);

    // Effet pour faire défiler le chat vers le bas
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Fonction pour envoyer un message
    const handleSend = async () => {
        if (!input.trim() || isLoading || !sessionId || !token) return;

        const currentInput = input;
        setInput("");
        setIsLoading(true);
        setLoadingMessage("Les agents analysent votre réponse...");
        
        try {
            const response = await analyseResponse(sessionId, currentInput, token);
            setMessages(response.chat_history || []);
            setStudentProfile(response.student_profile || null);
        } catch (error) {
            console.error("Erreur d'interaction:", error);
            setMessages((prev) => [...prev, { person: "system", message: `Erreur: ${error instanceof Error ? error.message : "Le serveur n'a pas pu répondre."}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Gère l'envoi avec la touche "Entrée"
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSend();
    };

    // Affichage d'un loader global pendant la vérification d'auth ou l'init de la session
    if (isAuthLoading || (isLoading && !sessionId)) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-slate-500 font-medium">{loadingMessage}</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex h-full">
            <div className="flex flex-col flex-1 bg-slate-100">
                <div className="bg-white border-b p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                    <Link href="/learn"><Button variant="ghost" size="icon"><ArrowLeft className="h-6 w-6 text-slate-500" /></Button></Link>
                    <h2 className="font-bold text-lg text-slate-700">Cas Clinique: {domaineNom}</h2>
                    <div className="w-10"></div> {/* Espace vide pour centrer le titre */}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {messages.map((msg, index) => (
                         <div key={index} className={`flex w-full ${ msg.person === "doctor" ? "justify-end" : "justify-start"}`}>
                            <div className={`flex max-w-[80%] ${msg.person === "doctor" ? "flex-row-reverse" : "flex-row"} gap-3`}>
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2 ${
                                    msg.person === "doctor" ? "bg-green-100 border-green-200" :
                                    msg.person === "patient" ? "bg-blue-100 border-blue-200" :
                                    msg.person === "tutor" ? "bg-yellow-100 border-yellow-200" : "bg-red-100 border-red-200"
                                }`}>
                                    {msg.person === "doctor" && <Stethoscope className="h-5 w-5 text-green-600" />}
                                    {msg.person === "patient" && <User className="h-5 w-5 text-blue-600" />}
                                    {msg.person === "tutor" && <GraduationCap className="h-5 w-5 text-yellow-600" />}
                                    {msg.person === "system" && <AlertCircle className="h-5 w-5 text-red-600" />}
                                </div>
                                <div className={`p-4 rounded-2xl shadow-sm text-sm relative ${
                                    msg.person === "doctor" ? "bg-green-500 text-white rounded-tr-none" :
                                    msg.person === "patient" ? "bg-white text-slate-700 border border-slate-200 rounded-tl-none" :
                                    msg.person === "tutor" ? "bg-yellow-50 text-yellow-800 border border-yellow-200 font-medium rounded-tl-none w-full" : "bg-red-50 text-red-800 border border-red-200 rounded-tl-none w-full"
                                }`}>
                                    {(msg.person === "tutor" || msg.person === "system") && (
                                        <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                                            {msg.person === "tutor" ? "Conseil du Tuteur" : "Message Système"}
                                        </span>
                                    )}
                                    {msg.message}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-center py-4">
                            <div className="flex items-center gap-2 text-slate-500 bg-white p-2 px-4 rounded-full border shadow-sm">
                                <Loader2 className="h-4 w-4 animate-spin"/>
                                <p className="text-sm font-medium">{loadingMessage}</p>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                <div className="p-4 bg-white border-t border-slate-200">
                    <div className="flex items-center gap-x-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={sessionId ? "Posez votre question au patient..." : "Veuillez patienter, la session charge..."}
                            disabled={isLoading || !sessionId}
                            className="flex-1 bg-slate-100 border-0 focus-visible:ring-2 focus-visible:ring-green-500 h-12 rounded-xl"
                        />
                        <Button onClick={handleSend} disabled={!input.trim() || isLoading || !sessionId} size="icon" className="h-12 w-12 shrink-0 rounded-xl">
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
            <StudentProfileSidebar profile={studentProfile} />
        </div>
    );
}