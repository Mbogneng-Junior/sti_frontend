"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { startTutorSession, sendTutorMessage, getTutorSessionState, endTutorSession, type TutorInteractionResponse, type EvaluationData, type SummativeData } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; 
import { Card } from "@/components/ui/card"; // Using Card for container
import { Send, ArrowLeft, Loader2, Info, ChevronRight, Stethoscope, User, LogOut } from "lucide-react"; // Icons from sidebar or similar pages
import Link from "next/link";
import { cn } from "@/lib/utils";
import { EvaluationModal } from "@/components/evaluation-modal";
import { SummativeModal } from "@/components/summative-modal";


interface Message {
  id: string;
  role: "doctor" | "patient" | "system";
  content: string;
  timestamp: Date;
}

export default function LessonPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const courseId = params.courseId as string;
  const initialSessionId = params.sessionId as string;
  const domainName = searchParams.get("domain") || courseId; 

  const [sessionId, setSessionId] = useState(initialSessionId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionInitializing, setSessionInitializing] = useState(true);
  const [evaluationData, setEvaluationData] = useState<EvaluationData | null>(null);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);
  
  const [summativeData, setSummativeData] = useState<SummativeData | null>(null);
  const [isSummativeOpen, setIsSummativeOpen] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Init
  useEffect(() => {
    if (authLoading) return;
    if (!user) return;

    const initSession = async () => {
      if (initialSessionId.startsWith("SESSION-")) {
        try {
          const decodedDomain = decodeURIComponent(domainName);
          console.log(`Starting session for ${user.email} in domain ${decodedDomain}`);
          const response = await startTutorSession(user.email, decodedDomain);
          
          setSessionId(response.session_id);
          setMessages([
            {
              id: "init-msg",
              role: "patient",
              content: response.message,
              timestamp: new Date()
            }
          ]);
          
          const newUrl = `/learn/${courseId}/lesson/${response.session_id}?domain=${encodeURIComponent(decodedDomain)}`;
          window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);
          
        } catch (error: any) {
          console.error("Failed to start session:", error);
          setMessages([
              {
                  id: "error-init",
                  role: "system",
                  content: `Erreur d'initialisation: ${error.message || "Impossible de démarrer la session."}`,
                  timestamp: new Date()
              }
          ])
        } finally {
          setSessionInitializing(false);
        }
      } else {
         try {
             // Retrieve existing history...
             const state = await getTutorSessionState(initialSessionId);
             if (state.chat_history && Array.isArray(state.chat_history)) {
                // Map history
                const mapped = state.chat_history.map((m: any, i:number) => ({
                    id: `restored-${i}`,
                    role: m.person === 'doctor' ? 'doctor' : 'patient',
                    content: m.message,
                    timestamp: new Date()
                }));
                // If no history, we might be in trouble, but let's assume empty
                setMessages(mapped);
             }
        } catch (e) {
             console.error(e);
        } finally {
             setSessionInitializing(false);
        }
      }
    };

    initSession();
  }, [user, authLoading, initialSessionId, courseId, domainName]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "doctor",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response: TutorInteractionResponse = await sendTutorMessage(sessionId, userMsg.content);
      
      if (response.latest_exchange.patient) {
        const patientMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "patient",
          content: response.latest_exchange.patient,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, patientMsg]);
      }

      // Check for Evaluation
      if (response.formative_evaluation) {
        setEvaluationData(response.formative_evaluation);
        setIsEvaluationOpen(true);
      }
    } catch (error) {
       console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (loading) return;
    setLoading(true);
    try {
        const data = await endTutorSession(sessionId);
        setSummativeData(data);
        setIsSummativeOpen(true);
    } catch (error) {
        console.error("Failed to end session:", error);
    } finally {
        setLoading(false);
    }
  };

  if (sessionInitializing || authLoading) {
    return (
        <div className="flex h-full items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-500">Chargement du patient...</span>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] lg:h-[calc(100vh-40px)] gap-4 pb-4">
      {/* Breadcrumb / Header */}
      <div className="flex items-center gap-2 text-sm text-gray-500 px-1">
         <Link href="/learn" className="hover:text-blue-600 transition-colors">
            Tableau de bord
         </Link>
         <ChevronRight className="h-4 w-4" />
         <span className="font-medium text-gray-900 capitalize">{decodeURIComponent(domainName)}</span>
      </div>

      {/* Main Card Container */}
      <Card className="flex-1 flex flex-col overflow-hidden shadow-sm border-gray-200">
        {/* Chat Header inside Card */}
        <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Stethoscope className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                     <h2 className="font-semibold text-gray-800">Consultation en cours</h2>
                     <p className="text-xs text-green-600 flex items-center gap-1">
                        <span className="block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        Patient en ligne
                     </p>
                </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleEndSession} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" />
                Terminer
            </Button>
        </div>

        {/* Messages List - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white" ref={scrollRef}>
             {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                     <Info className="h-12 w-12 mb-2 opacity-20" />
                     <p>La conversation démarre...</p>
                </div>
             )}

             {messages.map((msg) => (
                <div key={msg.id} className={cn("flex w-full gap-3", msg.role === "doctor" ? "justify-end" : "justify-start")}>
                    {/* Patient Avatar */}
                    {msg.role === "patient" && (
                        <Avatar className="h-8 w-8 mt-1 border border-gray-100">
                            <AvatarFallback className="bg-emerald-50 text-emerald-600 text-xs">P</AvatarFallback>
                        </Avatar>
                    )}

                     {/* System Message */}
                     {msg.role === "system" ? (
                         <div className="w-full flex justify-center">
                              <span className="bg-red-50 text-red-500 text-xs px-3 py-1 rounded-full">{msg.content}</span>
                         </div>
                     ) : (
                         <div className={cn(
                             "max-w-[75%] px-4 py-3 text-sm shadow-sm",
                             msg.role === "doctor" 
                               ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm" 
                               : "bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm"
                         )}>
                             {msg.content}
                         </div>
                     )}

                     {/* Doctor Avatar */}
                     {msg.role === "doctor" && (
                        <Avatar className="h-8 w-8 mt-1 border border-blue-100">
                            <AvatarFallback className="bg-blue-50 text-blue-600 text-xs">VM</AvatarFallback>
                        </Avatar>
                     )}
                </div>
             ))}

             {loading && (
                 <div className="flex w-full justify-start gap-3 animate-pulse">
                     <div className="h-8 w-8 bg-gray-200 rounded-full" />
                     <div className="bg-gray-100 h-10 w-24 rounded-2xl" />
                 </div>
             )}
        </div>

        {/* Input Footer */}
        <div className="p-4 bg-gray-50 border-t">
           <div className="flex gap-2">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Interrogez le patient..."
                className="bg-white border-gray-200 focus-visible:ring-blue-500"
                disabled={loading}
              />
              <Button onClick={handleSendMessage} disabled={!input.trim() || loading} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4" />
              </Button>
           </div>
        </div>
      </Card>

      <EvaluationModal 
        isOpen={isEvaluationOpen}
        onClose={() => setIsEvaluationOpen(false)}
        data={evaluationData}
      />

      <SummativeModal 
        isOpen={isSummativeOpen}
        onClose={() => {
            setIsSummativeOpen(false);
            router.push('/learn');
        }}
        data={summativeData}
      />
    </div>
  );
}
