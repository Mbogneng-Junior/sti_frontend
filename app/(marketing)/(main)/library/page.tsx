"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, FileText, Video, Download, Bookmark } from "lucide-react";

// Données simulées pour la bibliothèque
const RESOURCES = [
  {
    id: 1,
    title: "Guide de prise en charge du Paludisme Grave",
    type: "PDF",
    category: "Infectiologie",
    author: "OMS / MinSanté",
    date: "2024",
    readTime: "15 min",
    description: "Protocole national standardisé pour le traitement du paludisme sévère chez l'enfant et l'adulte.",
    downloadUrl: "#",
    tags: ["Urgence", "Pédiatrie", "Parasitologie"]
  },
  {
    id: 2,
    title: "Sémiologie Cardiaque : Les Souffles",
    type: "Vidéo",
    category: "Cardiologie",
    author: "Dr. Fultang",
    date: "2023",
    readTime: "12 min",
    description: "Vidéo interactive expliquant comment distinguer les différents souffles systoliques et diastoliques.",
    downloadUrl: "#",
    tags: ["Examen Clinique", "Auscultation"]
  },
  {
    id: 3,
    title: "Antibiothérapie en pratique courante",
    type: "Article",
    category: "Thérapeutique",
    author: "Revue Médicale",
    date: "2025",
    readTime: "8 min",
    description: "Synthèse sur les nouvelles recommandations de prescription d'antibiotiques pour les infections respiratoires.",
    downloadUrl: "#",
    tags: ["Pharmacologie", "Pneumologie"]
  },
  {
    id: 4,
    title: "Score de Glasgow et évaluation neurologique",
    type: "Outil",
    category: "Neurologie",
    author: "Urgences 2.0",
    date: "2023",
    readTime: "5 min",
    description: "Fiche mémo pratique pour l'évaluation rapide de l'état de conscience aux urgences.",
    downloadUrl: "#",
    tags: ["Urgence", "Traumatologie"]
  },
  {
    id: 5,
    title: "Diabète de Type 2 : Nouveaux traitements",
    type: "PDF",
    category: "Endocrinologie",
    author: "Société Francophone du Diabète",
    date: "2024",
    readTime: "20 min",
    description: "Analyse des inhibiteurs SGLT2 et agonistes GLP-1 dans la prise en charge moderne.",
    downloadUrl: "#",
    tags: ["Métabolisme", "Chronique"]
  }
];

const CATEGORIES = ["Tout", "Infectiologie", "Cardiologie", "Thérapeutique", "Neurologie", "Endocrinologie", "Pédiatrie"];

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tout");

  // Filtrage
  const filteredResources = RESOURCES.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tout" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            Bibliothèque Médicale
          </h1>
          <p className="text-gray-500 mt-2">
            Ressources, guides cliniques et cours pour approfondir vos connaissances.
          </p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Rechercher un document, un cours..." 
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Tabs */}
      <Tabs defaultValue="Tout" className="w-full" onValueChange={setSelectedCategory}>
        <TabsList className="w-full justify-start overflow-x-auto bg-transparent p-0 h-auto gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <TabsTrigger 
              key={cat} 
              value={cat}
              className="px-4 py-2 rounded-full border border-gray-200 bg-white data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:border-blue-600 transition-all font-medium text-gray-600"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Aucune ressource trouvée pour &quot;{searchQuery}&quot;.</p>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}

function ResourceCard({ resource }: { resource: typeof RESOURCES[0] }) {
  const getIcon = (type: string) => {
    switch(type) {
      case 'PDF': return <FileText className="h-5 w-5 text-red-500" />;
      case 'Vidéo': return <Video className="h-5 w-5 text-purple-500" />;
      default: return <BookOpen className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group border-gray-100">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                {resource.category}
            </Badge>
            {getIcon(resource.type)}
        </div>
        <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
            {resource.title}
        </CardTitle>
        <CardDescription className="flex items-center gap-2 text-xs mt-1">
            <span>{resource.author}</span>
            <span>•</span>
            <span>{resource.date}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {resource.description}
        </p>
        <div className="flex flex-wrap gap-2">
            {resource.tags.map(tag => (
                <span key={tag} className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    #{tag}
                </span>
            ))}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t bg-gray-50/50 flex justify-between items-center">
        <span className="text-xs text-slate-500 font-medium">{resource.readTime} de lecture</span>
        <div className="flex gap-2">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                <Bookmark className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="h-8 gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                <Download className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:text-xs">Accéder</span>
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
