"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assure-toi d'avoir ce composant shadcn ou utilise un input standard
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Données fictives (Simulées)
const COURSES = [
  {
    id: "paludisme",
    title: "Le Paludisme",
    description: "Comprendre, prévenir et traiter le paludisme.",
    image: "/paludisme.png",
    color: "bg-green-500", // Couleur de la bannière
    tags: ["Infectieux", "Tropical"],
  },
  {
    id: "diabete",
    title: "Le Diabète",
    description: "Gérer la glycémie et vivre avec le diabète.",
    image: "/diabete.png",
    color: "bg-blue-500",
    tags: ["Chronique", "Nutrition"],
  },
  {
    id: "avc",
    title: "L'AVC",
    description: "Reconnaître les signes et réagir vite.",
    image: "/avc.png",
    color: "bg-red-500",
    tags: ["Urgence", "Cerveau"],
  },
  {
    id: "cancer-col",
    title: "Cancer du Col",
    description: "Prévention, dépistage et traitement.",
    image: "/cervical_cancer.png",
    color: "bg-pink-500",
    tags: ["Cancer", "Femme"],
  },
];

export default function LearnDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrer les cours selon la recherche
  const filteredCourses = COURSES.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-6 py-6 flex flex-col gap-y-8 max-w-[900px] mx-auto">
      
      {/* 1. En-tête et Barre de recherche */}
      <div className="flex flex-col gap-y-4">
        <h1 className="text-3xl font-extrabold text-neutral-700">
          Que souhaitez-vous apprendre aujourd'hui ?
        </h1>
        
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <Input 
            placeholder="Rechercher un cours (ex: Paludisme)..."
            className="pl-10 h-12 rounded-xl border-2 border-slate-200 bg-white focus-visible:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filtres rapides (Optionnel) */}
        <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" className="rounded-full text-slate-600">Tout</Button>
            <Button variant="ghost" size="sm" className="rounded-full text-slate-500">Maladies infectieuses</Button>
            <Button variant="ghost" size="sm" className="rounded-full text-slate-500">Maladies chroniques</Button>
        </div>
      </div>

      {/* 2. Grille des cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        {filteredCourses.map((course) => (
          <Link href={`/learn/${course.id}`} key={course.id}>
            <div className="group border-2 border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:border-slate-300 hover:shadow-md transition-all bg-white flex flex-col h-full">
              
              {/* Image / Header de la carte */}
              <div className={`${course.color} h-[100px] w-full flex items-center justify-center p-4 relative`}>
                 <div className="bg-white/20 absolute inset-0 group-hover:bg-white/10 transition"/>
                 <Image 
                    src={course.image} 
                    alt={course.title} 
                    width={60} 
                    height={60} 
                    className="object-contain drop-shadow-md transform group-hover:scale-110 transition duration-300"
                 />
              </div>

              {/* Contenu de la carte */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                    <h3 className="font-bold text-xl text-neutral-700 mb-2 group-hover:text-green-600 transition">
                    {course.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                    {course.description}
                    </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    {/* Tags */}
                    <div className="flex gap-1">
                        {course.tags.slice(0, 1).map(tag => (
                            <span key={tag} className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <Button size="sm" variant="secondary" className="font-bold">
                        Commencer
                    </Button>
                </div>
              </div>

            </div>
          </Link>
        ))}

        {filteredCourses.length === 0 && (
            <div className="col-span-full text-center py-10 text-slate-500">
                Aucun cours trouvé pour "{searchQuery}".
            </div>
        )}
      </div>
    </div>
  );
}