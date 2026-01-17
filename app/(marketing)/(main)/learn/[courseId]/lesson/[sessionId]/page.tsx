"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { analyseResponse, getSessionState } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Settings,
  Send,
  Loader2,
  User,
  Stethoscope,
  FlaskConical,
  Pill,
  Activity,
  Heart,
  Wind,
  FileText,
  Clock,
  History,
  StickyNote,
  ArrowUp,
  CheckCircle,
  AlertCircle,
  Zap
} from "lucide-react";

// Types
type Role = "doctor" | "patient" | "tutor" | "system";
interface Message {
  person: Role;
  message: string;
  timestamp?: string;
}

// Donnees simulees du patient
const PATIENT_DATA = {
  name: "Alex Johnson",
  age: 45,
  gender: "Male",
  avatar: "/avatars/patient.png",
  chiefComplaint: "Persistent chest pain and shortness of breath for the last hour.",
  vitals: {
    bp: { value: "140/90", status: "elevated" as const },
    heartRate: { value: "88 bpm", status: "normal" as const },
    o2Sat: { value: "98%", status: "normal" as const }
  }
};

// Donnees simulees des findings
const INITIAL_FINDINGS = [
  { id: "1", label: "EKG Ordered", status: "pending" as const },
  { id: "2", label: "Temp Checked", value: "98.6°F", status: "normal" as const }
];

// Composant pour les signes vitaux
const VitalSign = ({
  icon: Icon,
  label,
  value,
  status
}: {
  icon: any;
  label: string;
  value: string;
  status: "normal" | "elevated" | "low";
}) => (
  <div className="flex items-center gap-3">
    <div className={`p-2 rounded-lg ${
      status === "elevated" ? "bg-red-50" : status === "low" ? "bg-amber-50" : "bg-green-50"
    }`}>
      <Icon className={`h-4 w-4 ${
        status === "elevated" ? "text-red-500" : status === "low" ? "text-amber-500" : "text-green-500"
      }`} />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <div className="flex items-center gap-1">
        <p className="text-sm font-semibold text-gray-900">{value}</p>
        {status === "elevated" && <ArrowUp className="h-3 w-3 text-red-500" />}
      </div>
    </div>
  </div>
);

// Composant pour les outils medicaux
const MedicalToolButton = ({
  icon: Icon,
  label,
  description,
  onClick
}: {
  icon: any;
  label: string;
  description: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
  >
    <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
      <Icon className="h-5 w-5 text-blue-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <p className="text-xs text-gray-500 truncate">{description}</p>
    </div>
  </button>
);

// Composant principal
export default function SimulationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token, isLoading: isAuthLoading, role } = useAuth();

  const courseId = params.courseId as string;
  const sessionId = params.sessionId as string;

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [findings, setFindings] = useState(INITIAL_FINDINGS);
  const [sessionStartTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

  const bottomRef = useRef<HTMLDivElement>(null);

  // Charger la session
  useEffect(() => {
    // Attendre que l'authentification soit chargée
    if (isAuthLoading) return;

    // Si pas d'utilisateur, afficher le message approprié
    if (!user || !token) {
      setIsInitialLoading(false);
      return;
    }

    if (!sessionId) {
      setIsInitialLoading(false);
      setMessages([{ person: "system", message: "Invalid session ID." }]);
      return;
    }

    const loadSession = async () => {
      try {
        const state = await getSessionState(sessionId, token);
        setMessages(state.chat_history || [
          {
            person: "patient",
            message: "Je ressens cette pression dans ma poitrine depuis une heure. J'ai du mal à respirer. J'ai un peu peur, honnêtement."
          }
        ]);
      } catch (error) {
        setMessages([
          {
            person: "patient",
            message: "Je ressens cette pression dans ma poitrine depuis une heure. J'ai du mal à respirer. J'ai un peu peur, honnêtement."
          }
        ]);
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadSession();
  }, [isAuthLoading, user, token, sessionId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  // Envoyer un message
  const handleSend = async () => {
    if (!input.trim() || isSending || !sessionId || !token) return;

    const currentInput = input;
    const newMessage: Message = {
      person: 'doctor',
      message: currentInput,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await analyseResponse(sessionId, currentInput, token);
      setMessages(response.chat_history || [...messages, newMessage]);
    } catch (error) {
      // Simuler une reponse du patient
      setTimeout(() => {
        setMessages(prev => [...prev, {
          person: "patient",
          message: "It's a dull ache, mostly in the center of my chest. It does feel a bit tight in my left shoulder too. It started while I was mowing the lawn."
        }]);
      }, 1000);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEndConsultation = () => {
    router.push(`/learn/${courseId}`);
  };

  const handleMakeDiagnosis = () => {
    // TODO: Ouvrir modal de diagnostic
    console.log("Make diagnosis");
  };

  const handleOrderLabTests = () => {
    setFindings(prev => [...prev, { id: Date.now().toString(), label: "Blood Panel Ordered", status: "pending" as const }]);
  };

  const handlePhysicalExam = () => {
    setMessages(prev => [...prev, {
      person: "system",
      message: "Physical Exam: Breath sounds are clear bilaterally. No murmurs noted on auscultation."
    }]);
  };

  const handleAdministerMeds = () => {
    // TODO: Ouvrir modal de medication
    console.log("Administer meds");
  };

  if (isAuthLoading || isInitialLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-gray-500 font-medium">Chargement de la simulation...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié
  if (!user || !token) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-50">
        <p className="text-slate-600">Vous devez être connecté pour accéder à cette simulation.</p>
        <Link href="/">
          <Button>Se connecter</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Patient Info */}
      <div className="w-72 bg-white border-r border-gray-100 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900 text-sm">Clinical Simulation AI</h1>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-500">Session Active: {sessionStartTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Profile */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-14 w-14 ring-2 ring-blue-100">
              <AvatarImage src={PATIENT_DATA.avatar} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
                {PATIENT_DATA.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-gray-900">{PATIENT_DATA.name}</h2>
              <p className="text-sm text-gray-500">{PATIENT_DATA.age} years old | {PATIENT_DATA.gender}</p>
            </div>
          </div>

          {/* Chief Complaint */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
            <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">Chief Complaint</p>
            <p className="text-sm text-amber-900">{PATIENT_DATA.chiefComplaint}</p>
          </div>
        </div>

        {/* Vitals */}
        <div className="p-4 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Current Vitals</p>
          <div className="space-y-3">
            <VitalSign icon={Activity} label="BP" value={PATIENT_DATA.vitals.bp.value} status={PATIENT_DATA.vitals.bp.status} />
            <VitalSign icon={Heart} label="Heart Rate" value={PATIENT_DATA.vitals.heartRate.value} status={PATIENT_DATA.vitals.heartRate.status} />
            <VitalSign icon={Wind} label="O2 Sat" value={PATIENT_DATA.vitals.o2Sat.value} status={PATIENT_DATA.vitals.o2Sat.status} />
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 flex-1">
          <nav className="space-y-1">
            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-blue-600 bg-blue-50">
              <User className="h-4 w-4" />
              Patient Overview
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              <History className="h-4 w-4" />
              Medical History
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              <StickyNote className="h-4 w-4" />
              Notes
            </Link>
          </nav>
        </div>
      </div>

      {/* Center - Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">SIMULATION STARTED - {sessionStartTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-500">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEndConsultation}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              End Consultation
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.person === "doctor" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-end gap-3 max-w-[80%] ${msg.person === "doctor" ? "flex-row-reverse" : "flex-row"}`}>
                  {/* Avatar */}
                  {msg.person !== "doctor" && msg.person !== "system" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className={`text-xs font-medium ${
                        msg.person === "patient" ? "bg-blue-100 text-blue-600" :
                        msg.person === "tutor" ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-600"
                      }`}>
                        {msg.person === "patient" ? "AJ" : msg.person === "tutor" ? "T" : "S"}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  {/* Message Bubble */}
                  <div className={`relative ${
                    msg.person === "doctor"
                      ? "bg-blue-600 text-white rounded-2xl rounded-br-md"
                      : msg.person === "patient"
                        ? "bg-white border border-gray-200 text-gray-900 rounded-2xl rounded-bl-md shadow-sm"
                        : msg.person === "tutor"
                          ? "bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl shadow-sm"
                          : "bg-green-50 border border-green-200 text-green-900 rounded-2xl shadow-sm"
                  } px-4 py-3`}>
                    {/* Role indicator for doctor */}
                    {msg.person === "doctor" && (
                      <div className="absolute -top-5 right-0">
                        <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-700 font-medium">
                          Medical Student
                        </Badge>
                      </div>
                    )}

                    {/* Name for patient */}
                    {msg.person === "patient" && (
                      <p className="text-xs font-medium text-gray-500 mb-1">{PATIENT_DATA.name}</p>
                    )}

                    {/* Tutor/System label */}
                    {(msg.person === "tutor" || msg.person === "system") && (
                      <p className="text-xs font-semibold uppercase tracking-wide mb-1">
                        {msg.person === "tutor" ? "Tutor Advice" : "System"}
                      </p>
                    )}

                    <p className="text-sm leading-relaxed">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isSending && (
              <div className="flex justify-start">
                <div className="flex items-end gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-medium">AJ</AvatarFallback>
                  </Avatar>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md shadow-sm px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-100 p-4">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${PATIENT_DATA.name.split(' ')[0]} a question...`}
                disabled={isSending}
                className="bg-gray-50 border-0 h-12 pl-4 pr-12 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isSending}
              className="h-12 w-12 rounded-xl bg-blue-600 hover:bg-blue-700 shrink-0"
            >
              {isSending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel - Medical Tools */}
      <div className="w-80 bg-white border-l border-gray-100 flex flex-col">
        {/* Medical Tools */}
        <div className="p-4 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Medical Tools
          </p>
          <div className="space-y-1">
            <MedicalToolButton
              icon={FlaskConical}
              label="Order Lab Tests"
              description="Bloodwork, cardiac enzymes, and imaging requests"
              onClick={handleOrderLabTests}
            />
            <MedicalToolButton
              icon={Stethoscope}
              label="Physical Exam"
              description="Perform auscultation, palpation, or neurological checks"
              onClick={handlePhysicalExam}
            />
            <MedicalToolButton
              icon={Pill}
              label="Administer Meds"
              description="Give IV fluids, aspirin, or other urgent treatments"
              onClick={handleAdministerMeds}
            />
          </div>
        </div>

        {/* Make Diagnosis Button */}
        <div className="p-4 border-b border-gray-100">
          <Button
            onClick={handleMakeDiagnosis}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25"
          >
            <Stethoscope className="h-5 w-5 mr-2" />
            Make Diagnosis
          </Button>
          <p className="text-xs text-gray-500 text-center mt-2">Conclude the simulation</p>
        </div>

        {/* Recent Findings */}
        <div className="p-4 flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Recent Findings</p>
          <div className="space-y-2">
            {findings.map((finding) => (
              <div key={finding.id} className="flex items-center gap-2 text-sm">
                {finding.status === "pending" ? (
                  <Clock className="h-4 w-4 text-amber-500" />
                ) : finding.status === "normal" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-gray-700">{finding.label}</span>
                {finding.status === "pending" && (
                  <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-700">Pending results</Badge>
                )}
                {finding.value && (
                  <span className="text-gray-500">- {finding.value} <span className="text-green-600">[Normal]</span></span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
