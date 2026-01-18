"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Award, TrendingUp, AlertTriangle, Stethoscope, CheckCircle2 } from "lucide-react";

export interface SummativeData {
  score_global: number;
  score_communication: number;
  score_anamnese: number;
  score_diagnostic: number;
  score_prise_en_charge: number;
  difficultes_identifiees: string[];
  points_forts: string[];
  feedback_global: string;
}

interface SummativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SummativeData | null;
}

export function SummativeModal({ isOpen, onClose, data }: SummativeModalProps) {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        
        {/* Header */}
        <DialogHeader className="p-6 pb-2 bg-indigo-50 dark:bg-indigo-950/30">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full shadow-sm">
                <Award className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
                <DialogTitle className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    Bilan de compétence
                </DialogTitle>
                <DialogDescription className="text-indigo-600/80 dark:text-indigo-300">
                    Fin de la consultation
                </DialogDescription>
            </div>
            <div className="ml-auto flex flex-col items-end">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Score Global</span>
                <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{data.score_global}/100</span>
            </div>
          </div>
        </DialogHeader>

        {/* Content Scrollable */}
        <ScrollArea className="flex-1 p-6">
            <div className="space-y-8">
                
                {/* 1. Scores Détaillés */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Performance par domaine
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ScoreItem label="Communication" score={data.score_communication} />
                        <ScoreItem label="Anamnèse" score={data.score_anamnese} />
                        <ScoreItem label="Diagnostic" score={data.score_diagnostic} />
                        <ScoreItem label="Prise en charge" score={data.score_prise_en_charge} />
                    </div>
                </div>

                {/* 2. Feedback Global */}
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-slate-500" /> Avis du Superviseur
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                        "{data.feedback_global}"
                    </p>
                </div>

                {/* 3. Points Forts & Faibles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Points Forts */}
                    <div>
                        <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Points Forts
                        </h3>
                        <ul className="space-y-2">
                            {data.points_forts.map((pt, i) => (
                                <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                                    {pt}
                                </li>
                            ))}
                            {data.points_forts.length === 0 && <li className="text-xs text-slate-400 italic">Aucun point fort spécifique détecté.</li>}
                        </ul>
                    </div>

                    {/* Difficultés */}
                    <div>
                        <h3 className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> Axes d'amélioration
                        </h3>
                        <ul className="space-y-2">
                            {data.difficultes_identifiees.map((pt, i) => (
                                <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                                    {pt}
                                </li>
                            ))}
                            {data.difficultes_identifiees.length === 0 && <li className="text-xs text-slate-400 italic">Aucune difficulté majeure identifiée. Bravo !</li>}
                        </ul>
                    </div>
                </div>

            </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="p-4 border-t bg-slate-50 dark:bg-slate-900/50">
          <Button onClick={onClose} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
            Retour au Tableau de bord
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ScoreItem({ label, score }: { label: string, score: number }) {
    let colorClass = "bg-indigo-600";
    if (score < 50) colorClass = "bg-red-500";
    else if (score < 75) colorClass = "bg-orange-500";
    else colorClass = "bg-green-500";

    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600 dark:text-slate-300">{label}</span>
                <span className={score < 50 ? "text-red-600" : (score >= 75 ? "text-green-600" : "text-slate-900")}>{score}%</span>
            </div>
            <Progress value={score} className="h-2" indicatorClassName={colorClass} />
        </div>
    );
}
