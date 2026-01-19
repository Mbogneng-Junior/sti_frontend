"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  ChevronRight, 
  LayoutDashboard, 
  Library, 
  Check,
  Stethoscope,
  ArrowRight
} from "lucide-react";

const steps = [
  {
    title: "Bienvenue, Docteur",
    description: "Votre espace de validation clinique est prêt. Ensemble, améliorons la précision du diagnostic par l'IA.",
    icon: <Rocket className="w-8 h-8 text-blue-500" />,
    color: "from-blue-500 to-indigo-600",
    image: "👨‍⚕️"
  },
  {
    title: "Gestion des Cas",
    description: "C'est ici que vous examinez les cas de votre spécialité. Validez les données ou rejetez-les avec précision.",
    icon: <LayoutDashboard className="w-8 h-8 text-emerald-500" />,
    color: "from-emerald-400 to-teal-600",
    image: "📋"
  },
  {
    title: "Bibliothèque Globale",
    description: "Accédez à l'intégralité du dataset FultangMed. Filtrez par âge ou symptômes et exportez les données en un clic.",
    icon: <Library className="w-8 h-8 text-amber-500" />,
    color: "from-amber-400 to-orange-500",
    image: "📂"
  }
];

export function ExpertOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("expert_onboarding_v2");
    if (!hasSeen) setIsVisible(true);
  }, []);

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else finish();
  };

  const finish = () => {
    localStorage.setItem("expert_onboarding_v2", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[32px] shadow-2xl overflow-hidden max-w-lg w-full relative"
      >
        {/* Barre de progression colorée */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 transition-all duration-500 ${i <= currentStep ? `bg-gradient-to-r ${steps[i].color}` : 'bg-slate-100'}`}
            />
          ))}
        </div>

        <div className="p-8 pt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-center"
            >
              {/* Illustration / Icone */}
              <div className="relative inline-block">
                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${steps[currentStep].color} opacity-10 absolute inset-0 blur-xl`} />
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${steps[currentStep].color} flex items-center justify-center text-white shadow-lg mx-auto relative`}>
                  {steps[currentStep].icon}
                </div>
                <div className="absolute -bottom-2 -right-2 text-4xl leading-none">
                    {steps[currentStep].image}
                </div>
              </div>

              {/* Texte */}
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {steps[currentStep].title}
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                  {steps[currentStep].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-12 flex flex-col gap-3">
            <Button 
              onClick={next}
              className={`h-14 rounded-2xl text-lg font-bold shadow-lg transition-all active:scale-95 bg-gradient-to-r ${steps[currentStep].color} hover:opacity-90 text-white`}
            >
              {currentStep === steps.length - 1 ? "Commencer l'expérience" : "Continuer"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            {currentStep < steps.length - 1 && (
              <button 
                onClick={finish}
                className="text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors py-2"
              >
                Passer l'introduction
              </button>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Stethoscope className="w-3 h-3" /> Protocole Médical STI
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Check className="w-3 h-3" /> Certifié Fultang
            </div>
        </div>
      </motion.div>
    </div>
  );
}