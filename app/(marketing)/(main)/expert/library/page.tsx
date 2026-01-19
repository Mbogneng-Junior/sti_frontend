"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCases, getDomaines } from "@/lib/api";
import { 
  Library, Download, FileJson, FileSpreadsheet, 
  Search, Filter, User, Stethoscope, AlertCircle, Loader2, Eye 
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ExpertLibraryPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [domaines, setDomaines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // États pour les filtres (Requis par le PDF)
  const [filters, setFilters] = useState({
    min_age: "",
    max_age: "",
    symptom: "",
    pathologie: "",
    specialite: "all"
  });

  // Charger les cas et les domaines au montage
  useEffect(() => {
    fetchData();
    loadDomaines();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // On utilise les filtres dans l'appel API
      const data = await getCases({
        min_age: filters.min_age ? parseInt(filters.min_age) : undefined,
        max_age: filters.max_age ? parseInt(filters.max_age) : undefined,
        symptom: filters.symptom,
        pathologie: filters.pathologie,
        // Pour le téléchargement, on ne filtre pas par la spécialité de l'expert par défaut
      });
      setCases(data);
    } catch (error) {
      toast.error("Erreur de chargement des cas");
    } finally {
      setIsLoading(false);
    }
  };

  const loadDomaines = async () => {
    const data = await getDomaines();
    setDomaines(data);
  };

  // Fonction de téléchargement (JSON ou CSV)
  const handleExport = (format: 'json' | 'csv') => {
    const token = localStorage.getItem('authToken');
    const params = new URLSearchParams();
    if (filters.min_age) params.append('min_age', filters.min_age);
    if (filters.max_age) params.append('max_age', filters.max_age);
    if (filters.symptom) params.append('symptom', filters.symptom);
    if (filters.pathologie) params.append('pathologie', filters.pathologie);
    
    // On appelle l'URL d'extraction du backend
    const url = `http://localhost:8000/api/v1/extraction/export/${format}/?${params.toString()}`;

    fetch(url, { headers: { 'Authorization': `Token ${token}` } })
      .then(res => res.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `export_cas_${new Date().getTime()}.${format}`;
        link.click();
        toast.success(`Export ${format.toUpperCase()} lancé`);
      })
      .catch(() => toast.error("Erreur lors de l'export"));
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header avec Titre PDF */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Library className="h-8 w-8 text-blue-600" />
              Téléchargement des cas
            </h1>
            <p className="text-slate-500 mt-1">Accédez à l'ensemble du dataset clinique multi-spécialités</p>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={() => handleExport('json')} variant="outline" className="gap-2 border-blue-200 hover:bg-blue-50">
              <FileJson className="h-4 w-4 text-blue-600" /> JSON
            </Button>
            <Button onClick={() => handleExport('csv')} variant="outline" className="gap-2 border-green-200 hover:bg-green-50">
              <FileSpreadsheet className="h-4 w-4 text-green-600" /> CSV
            </Button>
          </div>
        </div>

        {/* Section Filtres Obligatoires (PDF) */}
        <Card className="border-0 shadow-sm ring-1 ring-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filtres de recherche & export
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Âge (Min - Max)</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Min" 
                    type="number" 
                    value={filters.min_age}
                    onChange={(e) => setFilters({...filters, min_age: e.target.value})}
                  />
                  <Input 
                    placeholder="Max" 
                    type="number" 
                    value={filters.max_age}
                    onChange={(e) => setFilters({...filters, max_age: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Symptôme</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input 
                    className="pl-9" 
                    placeholder="ex: Fièvre" 
                    value={filters.symptom}
                    onChange={(e) => setFilters({...filters, symptom: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Maladie / Pathologie</Label>
                <Input 
                  placeholder="ex: Paludisme" 
                  value={filters.pathologie}
                  onChange={(e) => setFilters({...filters, pathologie: e.target.value})}
                />
              </div>

              <div className="flex items-end">
                <Button onClick={fetchData} className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
                  Appliquer les filtres
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tableau de prévisualisation */}
        <Card className="border-0 shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                Chargement du dataset...
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold">Cas Clinique</TableHead>
                    <TableHead className="font-bold">Patient</TableHead>
                    <TableHead className="font-bold">Spécialité</TableHead>
                    <TableHead className="font-bold">Difficulté</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cases.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                        Aucun cas ne correspond à vos filtres.
                      </TableCell>
                    </TableRow>
                  ) : (
                    cases.map((c) => (
                      <TableRow key={c.id_unique} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell>
                          <div className="font-medium text-slate-900">{c.pathologie || c.motif_consultation}</div>
                          <div className="text-xs text-slate-400 font-mono">ID: {c.id_unique}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-slate-600">
                            <User className="h-4 w-4" />
                            {c.donnees_patient?.age} ans, {c.donnees_patient?.sexe}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0">
                            {c.specialite_medicale || "Médecine générale"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100">
                            {c.difficulte || "Intermédiaire"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/expert/editor/${c.id_unique}`}>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                              <Eye className="h-4 w-4 mr-2" /> Consulter
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}