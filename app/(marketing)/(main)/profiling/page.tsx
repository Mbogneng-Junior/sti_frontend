"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import * as api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Stethoscope,
  Activity,
  Brain,
  Heart
} from "lucide-react";
import { ProfilingQuestion } from "@/lib/api";

// Types
interface ProfilingScores {
  anamnese: number;
  diagnostic: number;
  traitement: number;
  relationnel: number;
}

interface ProfilingResults {
  scores: ProfilingScores;
}

export default function ProfilingPage() {
  const router = useRouter();
  const { token } = useAuth();
  
  const [questions, setQuestions] = useState<ProfilingQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for quiz execution
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [qId: number]: number }>({}); // qId -> optionIndex
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<ProfilingResults | null>(null);

  useEffect(() => {
    async function loadQuestions() {
      if (!token) return;
      try {
        const data = await api.getProfilingQuestions(token);
        // Ensure data is array
        if (Array.isArray(data)) {
            setQuestions(data);
        } else {
            console.error("Data received is not an array", data);
            setError("Format de données invalide reçu du serveur.");
        }
        setLoading(false);
      } catch (err: unknown) {
        console.error(err);
        setError("Impossible de charger les questions de profiling.");
        setLoading(false);
      }
    }
    loadQuestions();
  }, [token]);

  const handleOptionSelect = (optionIndex: number) => {
    if (!questions.length) return;
    const currentQ = questions[currentQuestionIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitQuiz = async () => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      const response = await api.submitProfiling(answers, token);
      setResults(response);
    } catch (err: unknown) {
      console.error(err);
      setError("Erreur lors de la soumission des réponses.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleContinue = () => {
      // Update local storage to reflect the change immediately without re-login
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
          const newUser = { ...JSON.parse(storedUser), est_profile: true };
          localStorage.setItem('authUser', JSON.stringify(newUser));
      }
      window.location.href = '/learn'; 
  };
  
  const handleSkip = async () => {
      if (!token) return;
      if (!window.confirm("Voulez-vous vraiment passer ce test ? Votre niveau sera initialisé à 'Débutant' partout.")) return;
      
      setIsSubmitting(true);
      try {
        // Send empty answers to initialize with 0/Beginner
        const response = await api.submitProfiling({}, token);
        setResults(response);
      } catch (err: unknown) {
        console.error(err);
        setError("Erreur lors de l'initialisation du profil.");
      } finally {
        setIsSubmitting(false);
      }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
            <p className="text-gray-500 font-medium">Chargement du test de positionnement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md border-red-200 shadow-lg">
                <CardContent className="pt-6 text-center space-y-4">
                    <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Une erreur est survenue</h2>
                    <p className="text-gray-600">{error}</p>
                    <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
                        Réessayer
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  // --- RESULT VIEW ---
  if (results) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-none shadow-xl overflow-hidden">
          <div className="bg-green-600 p-8 text-center text-white">
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Profil Initialisé !</h1>
            <p className="text-green-50">Merci docteur, nous avons calibré votre parcours.</p>
          </div>
          
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ScoreCard 
                    label="Anamnèse" 
                    score={results.scores.anamnese} 
                    icon={<Brain className="w-5 h-5 text-purple-600" />} 
                    color="bg-purple-100" 
                    barColor="bg-purple-600"
                />
                <ScoreCard 
                    label="Diagnostic" 
                    score={results.scores.diagnostic} 
                    icon={<Stethoscope className="w-5 h-5 text-blue-600" />} 
                    color="bg-blue-100" 
                    barColor="bg-blue-600"
                />
                <ScoreCard 
                    label="Traitement" 
                    score={results.scores.traitement} 
                    icon={<Activity className="w-5 h-5 text-emerald-600" />} 
                    color="bg-emerald-100" 
                    barColor="bg-emerald-600"
                />
                <ScoreCard 
                    label="Relationnel" 
                    score={results.scores.relationnel} 
                    icon={<Heart className="w-5 h-5 text-rose-600" />} 
                    color="bg-rose-100" 
                    barColor="bg-rose-600"
                />
            </div>
            
            <div className="pt-4">
                <Button onClick={handleContinue} className="w-full h-12 text-lg font-medium shadow-md transition-all hover:scale-[1.02]">
                    Accéder à mon tableau de bord <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- QUIZ VIEW ---
  const currentQ = questions[currentQuestionIndex];
  // Guard clause if questions array is empty but loading is false (edge case)
  if (!currentQ) return <div className="p-10 text-center">Aucune question disponible.</div>;

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasSelectedOption = answers[currentQ.id] !== undefined;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      {/* Header */}
      <div className="w-full max-w-4xl mb-8 flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Évaluation Initiale</h1>
            <p className="text-slate-500">Calibrage de votre niveau de compétence</p>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSkip} 
                className="text-slate-400 hover:text-slate-600 mb-1 h-auto py-1 px-2"
            >
                Passer l&apos;évaluation
            </Button>
            <div>
                <span className="text-sm font-semibold text-slate-900">Question {currentQuestionIndex + 1}</span>
                <span className="text-sm text-slate-400"> / {questions.length}</span>
            </div>
        </div>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
            ></div>
        </div>

        <Card className="border-none shadow-lg overflow-hidden">
            <div className="bg-slate-900 p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 border-none">
                        {currentQ.competence}
                    </Badge>
                </div>
                <h3 className="text-lg font-medium leading-relaxed italic text-slate-300 mb-2">
                    &quot;{currentQ.situation}&quot;
                </h3>
                <h2 className="text-xl md:text-2xl font-bold mt-4 leading-tight">
                    {currentQ.question_text}
                </h2>
            </div>
            
            <CardContent className="p-6 md:p-8 bg-white">
                <div className="space-y-4">
                    {currentQ.options.map((option: { texte: string; score: number; feedback: string }, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left group
                                ${answers[currentQ.id] === idx 
                                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100' 
                                    : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                                }
                            `}
                        >
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors
                                ${answers[currentQ.id] === idx 
                                    ? 'bg-blue-600 border-blue-600 text-white' 
                                    : 'bg-white border-slate-200 text-slate-400 group-hover:border-blue-400 group-hover:text-blue-500'
                                }
                            `}>
                                {String.fromCharCode(65 + idx)}
                            </div>
                            <span className={`text-lg ${answers[currentQ.id] === idx ? 'text-blue-900 font-medium' : 'text-slate-700'}`}>
                                {option.texte}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                    <Button 
                        variant="ghost" 
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className="text-slate-400 hover:text-slate-600"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
                    </Button>

                    <Button 
                        onClick={handleNext} 
                        disabled={!hasSelectedOption || isSubmitting}
                        className={`px-8 h-12 text-lg shadow-md transition-all ${
                            hasSelectedOption 
                                ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5' 
                                : 'bg-slate-200 text-slate-400'
                        }`}
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : isLastQuestion ? (
                            <>Terminer l&apos;évaluation <CheckCircle2 className="ml-2 h-5 w-5" /></>
                        ) : (
                            <>Question suivante <ArrowRight className="ml-2 h-5 w-5" /></>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ScoreCard({ label, score, icon, color, barColor }: { label: string; score: number; icon: React.ReactNode; color: string; barColor: string }) {
    return (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${color}`}>
                        {icon}
                    </div>
                    <span className="font-semibold text-slate-700">{label}</span>
                </div>
                <span className="font-bold text-slate-900">{Math.round(score)}%</span>
            </div>
            <Progress value={score} className="h-2" indicatorClassName={barColor} />
            {/* Note: indicatorClassName might need to be supported by the Progress component or use style prop if not supported */}
        </div>
    )
}
