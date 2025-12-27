"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Stethoscope, User, GraduationCap, Loader2, Sparkles, BarChart, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { analyseResponse, getSessionState } from "@/lib/api"; 

// Types pour les données du backend
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

// Sous-composant pour la barre latérale du profil (responsive)
const StudentProfileSidebar = ({ profile }: { profile: StudentProfile | null }) => {
    // La classe `hidden lg:flex` est la clé : le composant est caché par défaut,
    // et ne devient visible (en tant que flex container) qu'à partir du breakpoint 'lg' (grands écrans).
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
export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const { user, token, isLoading: isAuthLoading, role } = useAuth();

    const courseId = params.courseId as string;
    const sessionId = params.sessionId as string;
    const domaineNom = courseId.charAt(0).toUpperCase() + courseId.slice(1);
    
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Authentification...");

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);

    const bottomRef = useRef<HTMLDivElement>(null);

    // Effet pour charger la session
    useEffect(() => {
        if (isAuthLoading) return;
        if (!user || !token || role !== 'apprenant') {
            router.push('/');
            return;
        }
        if (!sessionId) {
            setIsInitialLoading(false);
            setMessages([{ person: "system", message: "ID de session invalide." }]);
            return;
        }

        const loadSession = async () => {
            setLoadingMessage("Chargement de la session...");
            try {
                const state = await getSessionState(sessionId, token);
                setMessages(state.chat_history || []);
                setStudentProfile(state.student_profile || null);
            } catch (error) {
                setMessages([{ person: "system", message: `Erreur : Impossible de charger la session.` }]);
            } finally {
                setIsInitialLoading(false);
            }
        };
        loadSession();
    }, [isAuthLoading, user, token, role, sessionId, router]);

    // Effet pour le scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isSending]);

    // Fonction d'envoi de message
    const handleSend = async () => {
        if (!input.trim() || isSending || !sessionId || !token) return;
        const currentInput = input;
        setMessages((prev) => [...prev, { person: 'doctor', message: currentInput }]);
        setInput("");
        setIsSending(true);
        try {
            const response = await analyseResponse(sessionId, currentInput, token);
            setMessages(response.chat_history || []);
            setStudentProfile(response.student_profile || null);
        } catch (error) {
            setMessages((prev) => [...prev, { person: "system", message: `Erreur: Le serveur n'a pas pu répondre.` }]);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSend();
    };

    if (isAuthLoading || isInitialLoading) {
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
                <div className="bg-white border-b p-2 sm:p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                    <Link href={`/learn/${courseId}`}>
                        <Button variant="ghost" size="sm" className="lg:size-md">
                            <ArrowLeft className="h-5 w-5 lg:h-6 lg:w-6 text-slate-500" />
                        </Button>
                    </Link>
                    <h2 className="font-bold text-base sm:text-lg text-slate-700 text-center truncate px-2">
                        Cas: {domaineNom}
                    </h2>
                    <div className="w-9 lg:w-10"></div> {/* Espace pour centrer le titre */}
                </div>

                <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-6">
                    {messages.map((msg, index) => (
                         <div key={index} className={`flex w-full ${ msg.person === "doctor" ? "justify-end" : "justify-start"}`}>
                            <div className={`flex max-w-[90%] sm:max-w-[80%] items-end ${msg.person === "doctor" ? "flex-row-reverse" : "flex-row"} gap-2 sm:gap-3`}>
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
                                <div className={`p-3 sm:p-4 rounded-2xl shadow-sm text-sm sm:text-base relative ${
                                    msg.person === "doctor" ? "bg-green-500 text-white rounded-tr-none" :
                                    msg.person === "patient" ? "bg-white text-slate-700 border border-slate-200 rounded-tl-none" :
                                    msg.person === "tutor" ? "bg-yellow-50 text-yellow-800 border border-yellow-200 font-medium rounded-tl-none w-full" : "bg-red-50 text-red-800 border border-red-200 rounded-tl-none w-full"
                                }`}>
                                    {(msg.person === "tutor" || msg.person === "system") && (
                                        <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                                            {msg.person === "tutor" ? "Conseil du Tuteur" : "Message Système"}
                                        </span>
                                    )}
                                    <p className="leading-relaxed">{msg.message}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {isSending && (
                         <div className="flex justify-start w-full">
                            <div className="flex items-end gap-2 sm:gap-3 ml-14">
                                <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2 bg-slate-100 border-slate-200">
                                    <User className="h-5 w-5 text-slate-500" />
                                </div>
                                <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl border border-slate-200">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                <div className="p-2 sm:p-4 bg-white border-t border-slate-200">
                    <div className="flex items-center gap-x-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={sessionId ? "Posez votre question au patient..." : "Chargement..."}
                            disabled={isSending || !sessionId}
                            className="flex-1 bg-slate-100 border-0 focus-visible:ring-2 focus-visible:ring-green-500 h-12 rounded-xl text-sm sm:text-base"
                        />
                        <Button onClick={handleSend} disabled={!input.trim() || isSending || !sessionId} size="icon" className="h-12 w-12 shrink-0 rounded-xl">
                            {isSending ? <Loader2 className="h-5 w-5 animate-spin"/> : <Send className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </div>
            <StudentProfileSidebar profile={studentProfile} />
        </div>
    );
}