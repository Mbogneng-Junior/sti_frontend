"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Clock,
  ArrowRight,
  Plus,
  Loader2,
  Calendar
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getStudentDashboardStats } from "@/lib/api"; 

// Structure des données de session (adaptée du backend plus tard)
interface Session {
  id: string;
  date: string;
  time: string;
  domain: string;
  caseTitle: string;
  messageCount: number;
  isCompleted: boolean;
  score: number | null;
}

// Données simulées temporaires (pour affichage initial)
const MOCK_SESSIONS: Session[] = [
  {
    id: "SESSION-1",
    date: "24 Jan 2026",
    time: "14:30",
    domain: "Paludisme",
    caseTitle: "Cas de Paludisme Simple",
    messageCount: 12,
    isCompleted: false,
    score: null
  },
  {
    id: "SESSION-2",
    date: "21 Jan 2026",
    time: "09:15",
    domain: "Paludisme",
    caseTitle: "Cas de Paludisme Sévère",
    messageCount: 24,
    isCompleted: true,
    score: 85
  }
];

export default function ChatListPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Plus tard: fetch from backend
    // const fetchSessions = async () => { ... }
  }, []);

  const handleResumeSession = (sessionId: string, domain: string) => {
    // Redirection vers la page de leçon existante
    // Communique avec /learn/[courseId]/lesson/[sessionId]
    const courseId = domain.toLowerCase(); 
    router.push(`/learn/${courseId}/lesson/${sessionId}`);
  };

  const handleStartNewSession = () => {
    const newSessionId = `SESSION-${Date.now()}`;
    // Par défaut on lance un cas de paludisme pour l'instant
    router.push(`/learn/paludisme/lesson/${newSessionId}`);
  };

  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Vos Conversations</h1>
            <p className="text-gray-500 mt-2">
              Retrouvez l'historique de vos cas cliniques et continuez votre apprentissage.
            </p>
          </div>
          <Button onClick={handleStartNewSession} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
            <Plus className="mr-2 h-4 w-4" /> Nouveau Cas
          </Button>
        </div>

        <div className="grid gap-4">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => handleResumeSession(session.id, session.domain)}>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${session.isCompleted ? 'bg-green-100' : 'bg-blue-100'}`}>
                    <MessageSquare className={`h-6 w-6 ${session.isCompleted ? 'text-green-600' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {session.caseTitle}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {session.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {session.date}
                      </span>
                      <Badge variant="secondary" className="text-xs font-normal">
                        {session.domain}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    {session.isCompleted ? (
                      <div>
                        <span className="text-xs text-gray-500 block uppercase tracking-wider">Score</span>
                        <span className="font-bold text-lg text-green-600">{session.score}%</span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        En cours
                      </span>
                    )}
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
