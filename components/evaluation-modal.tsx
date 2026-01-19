"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EvaluationData {
  competence: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: EvaluationData | null;
}

export function EvaluationModal({ isOpen, onClose, data }: EvaluationModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  if (!data) return null;

  const handleOptionClick = (option: string) => {
    if (showResult) return; 
    setSelectedOption(option);
    setShowResult(true);
  };

  const isCorrect = selectedOption === data.correct_answer;

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleNext()}>
      <DialogContent className="sm:max-w-xl bg-white dark:bg-slate-950 max-h-[85vh] overflow-y-auto block">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full shrink-0">
                <BrainCircuit className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <DialogTitle className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
                Évaluation Formative : {data.competence}
            </DialogTitle>
          </div>
          <DialogDescription className="text-lg text-slate-800 dark:text-slate-100 font-medium pt-2 leading-relaxed">
            {data.question}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-4">
          {data.options.map((option, index) => {
            let styles = "justify-start text-left h-auto py-4 px-4 hover:bg-slate-50 dark:hover:bg-slate-800 dark:border-slate-700 text-base";

            if (showResult) {
                if (option === data.correct_answer) {
                    styles = "justify-start text-left h-auto py-4 px-4 bg-green-50 border-green-500 text-green-900 font-medium hover:bg-green-50 dark:bg-green-900/20 dark:border-green-500 dark:text-green-300 dark:hover:bg-green-900/30";
                } else if (option === selectedOption) {
                    styles = "justify-start text-left h-auto py-4 px-4 bg-red-50 border-red-500 text-red-900 font-medium hover:bg-red-50 dark:bg-red-900/20 dark:border-red-500 dark:text-red-300 dark:hover:bg-red-900/30";
                } else {
                     styles = "justify-start text-left h-auto py-4 px-4 opacity-50 dark:opacity-40";
                }
            }

            return (
              <Button
                key={index}
                variant="outline"
                className={styles}
                onClick={() => handleOptionClick(option)}
                disabled={showResult && option !== data.correct_answer && option !== selectedOption}
              >
                <div className="flex items-center w-full">
                    <span className="bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 shrink-0 border dark:border-slate-600">
                        {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1 dark:text-slate-200">{option}</span>
                    {showResult && option === data.correct_answer && (
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 ml-auto" />
                    )}
                    {showResult && option === selectedOption && option !== data.correct_answer && (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 ml-auto" />
                    )}
                </div>
              </Button>
            );
          })}
        </div>

        {showResult && (
            <div className={cn(
                "p-4 rounded-lg mb-4 text-base",
                isCorrect 
                  ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200 dark:border dark:border-green-500/30" 
                  : "bg-orange-50 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200 dark:border dark:border-orange-500/30"
            )}>
                <p className="font-bold flex items-center gap-2 mb-1">
                    {isCorrect ? "Excellent ! " : "Pas tout à fait..."}
                </p>
                <p>{data.explanation}</p>
            </div>
        )}

        <DialogFooter>
            {showResult && (
                <Button onClick={handleNext} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-500 text-base py-6">
                    Continuer la consultation
                </Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
