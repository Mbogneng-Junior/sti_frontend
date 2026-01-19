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
import { getStudentSessions, type StudentSession } from "@/lib/api"; 

export default function ChatListPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [sessions, setSessions] = useState<StudentSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
        try {
            const data = await getStudentSessions();
            setSessions(data);
        } catch (e) {
            console.error("Failed to load sessions", e);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (user) {
        loadSessions();
    } else if (!isAuthLoading) {
        setIsLoading(false); // No user, stop loading
    }
  }, [user, isAuthLoading]);

  const handleResumeSession = (sessionId: string, domain: string) => {
    // Redirection vers la page de leçon existante
    const courseId = domain.toLowerCase().replace(/\s+/g, '-'); 
    router.push(`/learn/${courseId}/lesson/${sessionId}`);
  };

  const handleStartNewSession = () => {
    router.push(`/learn/new`);
  };

  if (isAuthLoading || isLoading) {
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

        <div className="space-y-4">
            {sessions.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Aucune conversation</h3>
                    <p className="text-gray-500 mt-1 max-w-sm mx-auto">Commencez une nouvelle consultation pour voir votre historique apparaître ici.</p>
                </div>
            ) : (
                sessions.map((session) => (
                    <Card key={session.id} className="hover:shadow-md transition-shadow border-gray-100 overflow-hidden group">
                    <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                        <div className="p-6 flex-1 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-6">
                            <div className="flex-shrink-0">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                    session.status === 'Terminée' 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-blue-100 text-blue-600'
                                }`}>
                                    <MessageSquare className="h-6 w-6" />
                                </div>
                            </div>
                            
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100">
                                        {session.domaine}
                                    </Badge>
                                    <span className="flex items-center text-xs text-gray-500">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {new Date(session.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {session.cas_titre}
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-4">
                                    <span className="flex items-center">
                                        <Clock className="w-3.5 h-3.5 mr-1" />
                                        {new Date(session.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {session.score > 0 && (
                                        <span className={`font-medium ${session.score >= 50 ? 'text-green-600' : 'text-orange-600'}`}>
                                            Score: {session.score}%
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="p-6 pt-0 sm:pt-6 sm:pl-0 sm:border-l border-gray-100 flex items-center">
                            <Button 
                                onClick={() => handleResumeSession(session.id, session.domaine)}
                                variant="ghost" 
                                className="w-full sm:w-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50 group/btn"
                            >
                                {session.status === 'Terminée' ? 'Revoir' : 'Continuer'}
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                        </div>
                        </div>
                    </CardContent>
                    </Card>
                ))
            )}
        </div>
      </div>
    </div>
  );
}

