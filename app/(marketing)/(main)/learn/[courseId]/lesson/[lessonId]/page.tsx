"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Stethoscope, User, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// Types pour nos messages
type Role = "doctor" | "patient" | "tutor";

interface Message {
  id: number;
  role: Role;
  content: string;
}

export default function LessonChatPage() {
  const params = useParams();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "tutor",
      content: "Bonjour Docteur. Votre patiente, Mme Diallo, se plaint de fièvre et de maux de tête depuis 3 jours. Commencez l'interrogatoire.",
    },
    {
      id: 2,
      role: "patient",
      content: "Bonjour Docteur... Je ne me sens vraiment pas bien.",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le bas à chaque message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // 1. Ajouter le message de l'étudiant (Docteur)
    const userMsg: Message = {
      id: Date.now(),
      role: "doctor",
      content: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // 2. Simuler la réponse du Patient et du Tuteur (Simulation IA fictive)
    setTimeout(() => {
      // Logique simple de réponse pour la démo
      let patientResponse = "J'ai très mal à la tête et j'ai des frissons.";
      let tutorFeedback = null;

      if (input.toLowerCase().includes("fièvre") || input.toLowerCase().includes("température")) {
        patientResponse = "Oui, j'ai eu 39°C hier soir.";
        tutorFeedback = "Bien joué ! Vérifier la fièvre est crucial pour suspecter le paludisme.";
      } else if (input.toLowerCase().includes("voyage") || input.toLowerCase().includes("zone")) {
        patientResponse = "Je suis revenue du village il y a une semaine.";
        tutorFeedback = "Excellent réflexe ! La notion de voyage est un indicateur clé.";
      }

      // Ajouter réponse patient
      const patientMsg: Message = {
        id: Date.now() + 1,
        role: "patient",
        content: patientResponse,
      };
      setMessages((prev) => [...prev, patientMsg]);

      // Ajouter feedback tuteur si pertinent
      if (tutorFeedback) {
        setTimeout(() => {
            const tutorMsg: Message = {
                id: Date.now() + 2,
                role: "tutor",
                content: tutorFeedback || "",
            };
            setMessages((prev) => [...prev, tutorMsg]);
        }, 1000); // Le tuteur intervient un peu après
      }

      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-3xl mx-auto bg-slate-50 border-x-2 border-slate-200">
      
      {/* HEADER DE LA LEÇON */}
      <div className="bg-white border-b p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-x-4">
            <Link href={`/learn/${params.courseId}`}>
                <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-6 w-6 text-slate-500" />
                </Button>
            </Link>
            <div>
                <h2 className="font-bold text-lg text-slate-700">Consultation : Mme Diallo</h2>
                <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    En direct
                </div>
            </div>
        </div>
        <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
            Abandonner
        </Button>
      </div>

      {/* ZONE DE CHAT */}
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

                {/* BULLE DE MESSAGE */}
                <div className={`p-4 rounded-2xl shadow-sm text-sm relative
                    ${msg.role === "doctor" 
                        ? "bg-green-500 text-white rounded-tr-none" 
                        : msg.role === "patient" 
                            ? "bg-white text-slate-700 border border-slate-200 rounded-tl-none" 
                            : "bg-yellow-50 text-yellow-800 border border-yellow-200 font-medium rounded-tl-none w-full"
                    }`}
                >
                    {/* Label pour le Tuteur */}
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
        
        {/* Indicateur de frappe */}
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

      {/* INPUT AREA */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex items-center gap-x-2 max-w-3xl mx-auto">
            <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez une question au patient (ex: Avez-vous de la fièvre ?)..."
                className="flex-1 bg-slate-100 border-0 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0 text-base py-6 rounded-xl"
                disabled={isTyping}
            />
            <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isTyping}
                className="h-12 w-12 rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-md transition-all"
            >
                <Send className="h-5 w-5" />
            </Button>
        </div>
        <div className="text-center mt-2">
            <span className="text-xs text-slate-400">Appuyez sur Entrée pour envoyer</span>
        </div>
      </div>
    </div>
  );
}