"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Stethoscope, User, GraduationCap, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner"; // Optionnel: pour les erreurs, sinon utilise console.error



// Types pour nos messages
type Role = "doctor" | "patient" | "tutor";

interface Message {
  id: string | number;
  role: Role;
  content: string;
}

export default function LessonChatPage() {
  const params = useParams();

  // On suppose que lessonId correspond à l'UUID du CasClinique dans ton backend
  const casCliniqueId = params.lessonId as string; 
  const courseId = params.courseId as string;
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const router = useRouter();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);


  // 1. INITIALISATION : Créer ou récupérer une session
  useEffect(() => {
    const initSession = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        console.log("Mon URL API est :", API_URL); //Pour verifier que tout se passe bien

        // ÉTAPE A : Récupérer un Apprenant (Temporaire pour le test si pas d'auth liée)
        // Dans le futur, tu utiliseras l'ID de l'utilisateur connecté via Clerk
        const usersRes = await fetch(`${API_URL}/apprenant/apprenants/`);
        const users = await usersRes.json();
        
        let apprenantId;
        if (users.length > 0) {
            apprenantId = users[0].id;
        } else {
            // Créer un utilisateur temporaire si la liste est vide
            const createRes = await fetch(`${API_URL}/apprenant/apprenants/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nom: "Test Student", email: `test${Date.now()}@sti.com` })
            });
            const newUser = await createRes.json();
            apprenantId = newUser.id;
        }

        // ÉTAPE B : Créer la Session d'apprentissage
        // On lie l'apprenant au cas clinique (lessonId)
        const sessionRes = await fetch(`${API_URL}/interface/sessions/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                apprenant: apprenantId,
                cas_clinique: casCliniqueId, // L'UUID du cas clinique
                date_debut: new Date().toISOString()
            })
        });

        if (!sessionRes.ok) throw new Error("Impossible de créer la session");
        const sessionData = await sessionRes.json();
        setSessionId(sessionData.id);

        // ÉTAPE C : Charger le contexte du cas clinique (Message initial du tuteur)
        const casRes = await fetch(`${API_URL}/expert/cas-cliniques/${casCliniqueId}/`);
        if (casRes.ok) {
            const casData = await casRes.json();
            setMessages([
                {
                    id: "intro",
                    role: "tutor",
                    content: `Bienvenue. Cas : ${casData.titre}. ${casData.historique_medical || "Commencez l'interrogatoire."}`
                }
            ]);
        }

      } catch (error) {
        console.error("Erreur init:", error);
        // Fallback message si erreur backend
        setMessages([{ id: "err", role: "tutor", content: "Erreur de connexion au serveur STI. Vérifiez que le Backend tourne."}]);
      } finally {
        setIsLoadingSession(false);
      }
    };

    if (casCliniqueId) {
        initSession();
    }
  }, [casCliniqueId]);






  // Scroll automatique
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 2. ENVOI DE MESSAGE (Interaction)
  const handleSend = async () => {
    if (!input.trim() || !sessionId) return;

    const currentInput = input;
    setInput(""); // Vider l'input tout de suite
    
    // Optimistic UI : On affiche le message du médecin tout de suite
    const tempId = Date.now();
    setMessages((prev) => [...prev, { id: tempId, role: "doctor", content: currentInput }]);
    setIsTyping(true);

    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        // Appel au endpoint /interactions/
        const res = await fetch(`${API_URL}/interface/interactions/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                session: sessionId,
                question_contenu: currentInput,
                // reponse_contenu sera généré par le backend/IA
            })
        });

        if (!res.ok) throw new Error("Erreur lors de l'envoi");

        const data = await res.json();

        // Ajout de la réponse du Patient (simulé par l'IA du backend)
        if (data.reponse_contenu) {
            setMessages((prev) => [...prev, {
                id: `${data.id}-patient`,
                role: "patient",
                content: data.reponse_contenu
            }]);
        }

        // Ajout du Feedback Tuteur (si existant)
        if (data.feedback_contenu) {
            // Petit délai pour simuler la lecture du tuteur
            setTimeout(() => {
                setMessages((prev) => [...prev, {
                    id: `${data.id}-tutor`,
                    role: "tutor",
                    content: data.feedback_contenu
                }]);
            }, 800);
        }

    } catch (error) {
        console.error("Erreur interaction:", error);
        setMessages((prev) => [...prev, { id: Date.now(), role: "tutor", content: "Erreur: Je n'ai pas pu analyser votre réponse."}]);
    } finally {
        setIsTyping(false);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

if (isLoadingSession) {
  return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-green-600" />
              <p className="text-slate-500 font-medium">Préparation de la salle de consultation...</p>
          </div>
      </div>
  );
}

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-3xl mx-auto bg-slate-50 border-x-2 border-slate-200">
      
      {/* HEADER */}
      <div className="bg-white border-b p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-x-4">
            <Link href={`/learn/${courseId}`}>
                <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-6 w-6 text-slate-500" />
                </Button>
            </Link>
            <div>
                <h2 className="font-bold text-lg text-slate-700">Consultation</h2>
                <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Connecté au STI
                </div>
            </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${
              msg.role === "doctor" ? "justify-end" : "justify-start"
            }`}
          >
            <div className={`flex max-w-[80%] ${msg.role === "doctor" ? "flex-row-reverse" : "flex-row"} gap-3`}>
                
                {/* AVATAR */}
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2
                    ${msg.role === "doctor" ? "bg-green-100 border-green-200" : 
                      msg.role === "patient" ? "bg-blue-100 border-blue-200" : "bg-yellow-100 border-yellow-200"
                    }`}
                >
                    {msg.role === "doctor" && <Stethoscope className="h-5 w-5 text-green-600" />}
                    {msg.role === "patient" && <User className="h-5 w-5 text-blue-600" />}
                    {msg.role === "tutor" && <GraduationCap className="h-5 w-5 text-yellow-600" />}
                </div>

                {/* MESSAGE CONTENT */}
                <div className={`p-4 rounded-2xl shadow-sm text-sm relative
                    ${msg.role === "doctor" 
                        ? "bg-green-500 text-white rounded-tr-none" 
                        : msg.role === "patient" 
                            ? "bg-white text-slate-700 border border-slate-200 rounded-tl-none" 
                            : "bg-yellow-50 text-yellow-800 border border-yellow-200 font-medium rounded-tl-none w-full"
                    }`}
                >
                    {msg.role === "tutor" && (
                        <span className="text-xs font-bold text-yellow-600 block mb-1 uppercase tracking-wider">
                            Conseil du Tuteur
                        </span>
                    )}
                    {msg.content}
                </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
             <div className="flex justify-start w-full">
                <div className="flex items-center gap-2 ml-14 bg-white px-4 py-3 rounded-2xl border border-slate-200">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                </div>
            </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex items-center gap-x-2 max-w-3xl mx-auto">
            <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question clinique..."
                className="flex-1 bg-slate-100 border-0 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0 text-base py-6 rounded-xl"
                disabled={isTyping || !sessionId}
            />
            <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isTyping || !sessionId}
                className="h-12 w-12 rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-md transition-all"
            >
                <Send className="h-5 w-5" />
            </Button>
        </div>
      </div>
    </div>
  );
}