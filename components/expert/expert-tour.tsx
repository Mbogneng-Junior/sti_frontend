"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
//import "driver.js/dist/driver.css";

export function ExpertTour() {
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("expert_tour_v5_completed");
    if (hasSeenTour) return;

    const driverObj = driver({
      showProgress: true,
      animate: true,
      // --- STYLE PERSONNALISÉ ---
      popoverClass: "fultang-tour-popover", 
      nextBtnText: "Suivant —",
      prevBtnText: "Retour",
      doneBtnText: "Terminer",
      steps: [
        { 
          popover: { 
            title: "👋 Bienvenue Docteur !", 
            description: "FultangMed est conçu pour simplifier votre expertise. Suivez ce guide pour découvrir vos outils.",
          } 
        },
        { 
          element: "#tour-gestion", 
          popover: { 
            title: "📋 Gestion des Cas", 
            description: "Examinez les cas de votre spécialité. Validez-les pour les publier ou rejetez-les avec un rapport détaillé.",
            side: "right",
          } 
        },
        { 
          element: "#tour-download", 
          popover: { 
            title: "📂 Bibliothèque Globale", 
            description: "Accédez à l'intégralité du dataset. Exportez les données en JSON ou CSV pour vos analyses externes.",
            side: "right",
          } 
        },
        { 
          element: ".grid", 
          popover: { 
            title: "📊 Votre Activité", 
            description: "Suivez vos statistiques et l'état d'avancement des validations cliniques en un coup d'œil.",
            side: "bottom",
          } 
        },
      ],
      onDestroyed: () => {
        localStorage.setItem("expert_tour_v5_completed", "true");
      }
    });

    setTimeout(() => driverObj.drive(), 1000);
  }, []);

  return null;
}