"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCases, getDomaines } from "@/lib/api";
import { Library, Download, FileJson, FileSpreadsheet, Search, Filter, User, Loader2, Eye, RotateCcw } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ExpertLibraryPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [domaines, setDomaines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    min_age: "",
    max_age: "",
    symptom: "",
    pathologie: "",
    specialite: "all"
  });

  useEffect(() => {
    fetchData();
    loadDomaines();
  }, []);

  // Génère les QueryParams pour l'API et l'Export
  const getQueryString = () => {
    const params = new URLSearchParams();
    if (filters.min_age) params.append('min_age', filters.min_age);
    if (filters.max_age) params.append('max_age', filters.max_age);
    if (filters.symptom) params.append('symptom', filters.symptom);
    if (filters.pathologie) params.append('pathologie', filters.pathologie);
    if (filters.specialite !== "all") params.append('specialite', filters.specialite);
    return params.toString();
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // On passe les filtres à l'API
      const data = await getCases({
        min_age: filters.min_age ? parseInt(filters.min_age) : undefined,
        max_age: filters.max_age ? parseInt(filters.max_age) : undefined,
        symptom: filters.symptom,
        pathologie: filters.pathologie,
        specialite: filters.specialite !== "all" ? filters.specialite : undefined
      });
      setCases(data);
    } catch (error) {
      console.error(error);
      toast.error("Erreur de filtrage");
    } finally {
      setIsLoading(false);
    }
  };

  const loadDomaines = async () => {
    const data = await getDomaines();
    setDomaines(data);
  };

  const resetFilters = () => {
    setFilters({ min_age: "", max_age: "", symptom: "", pathologie: "", specialite: "all" });
    // On relance la recherche avec les filtres vides
    setTimeout(() => fetchData(), 100);
  };

  const handleExport = (format: 'json' | 'csv') => {
    const token = localStorage.getItem('authToken');
    // ON UTILISE LES MÊMES FILTRES QUE LE TABLEAU
    const queryString = getQueryString();
    const url = `http://localhost:8000/api/v1/extraction/export/${format}/?${queryString}`;

    toast.info(`Préparation de l'export ${format.toUpperCase()}...`);

    fetch(url, { headers: { 'Authorization': `Token ${token}` } })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.blob();
      })
      .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `fultang_export_${format}_${new Date().toISOString().split('T')[0]}.${format}`;
        link.click();
        toast.success("Téléchargement réussi");
      })
      .catch(() => toast.error("Erreur lors de l'exportation"));
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Library className="h-8 w-8 text-blue-600" />
              Téléchargement des cas
            </h1>
            <p className="text-slate-500 mt-1">Dataset complet pour analyse et recherche</p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={() => handleExport('json')} variant="outline" className="bg-white gap-2">
              <FileJson className="h-4 w-4 text-orange-500" /> Export JSON
            </Button>
            <Button onClick={() => handleExport('csv')} variant="outline" className="bg-white gap-2">
              <FileSpreadsheet className="h-4 w-4 text-green-600" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Panneau de Filtres */}
        <Card className="border-0 shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
              
              <div className="space-y-2">
                <Label>Spécialité</Label>
                <Select value={filters.specialite} onValueChange={(v) => setFilters({...filters, specialite: v})}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les spécialités</SelectItem>
                    {domaines.map(d => <SelectItem key={d.id} value={d.nom}>{d.nom}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Maladie</Label>
                <Input 
                  placeholder="ex: Diabète" 
                  value={filters.pathologie}
                  onChange={(e) => setFilters({...filters, pathologie: e.target.value})}
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label>Âge (Min - Max)</Label>
                <div className="flex gap-2">
                  <Input placeholder="Min" type="number" value={filters.min_age} onChange={(e) => setFilters({...filters, min_age: e.target.value})} className="bg-white" />
                  <Input placeholder="Max" type="number" value={filters.max_age} onChange={(e) => setFilters({...filters, max_age: e.target.value})} className="bg-white" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Symptôme</Label>
                <Input placeholder="ex: Fièvre" value={filters.symptom} onChange={(e) => setFilters({...filters, symptom: e.target.value})} className="bg-white" />
              </div>

              <div className="flex gap-2">
                <Button onClick={fetchData} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Filter className="h-4 w-4 mr-2" /> Filtrer
                </Button>
                <Button onClick={resetFilters} variant="outline" size="icon" title="Réinitialiser">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Liste des résultats */}
        <Card className="border-0 shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="bg-white px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-700">{cases.length} cas trouvés</h3>
            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Dataset Public</Badge>
          </div>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                Mise à jour de la liste...
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead>Titre / ID</TableHead>
                    <TableHead>Démographie</TableHead>
                    <TableHead>Domaine</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cases.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-slate-500 italic">
                        Aucun résultat pour ces critères.
                      </TableCell>
                    </TableRow>
                  ) : (
                    cases.map((c) => (
                      <TableRow key={c.id_unique} className="hover:bg-slate-50/50 transition-colors group">
                        <TableCell>
                          <div className="font-semibold text-slate-900">{c.pathologie || c.motif_consultation}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{c.id_unique}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <User className="h-3.5 w-3.5" />
                            {c.donnees_patient?.age} ans, {c.donnees_patient?.sexe}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-medium">{c.specialite || c.specialite_medicale || "Général"}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs font-bold uppercase ${c.statut === 'PUBLIE' ? 'text-green-600' : 'text-orange-500'}`}>
                            {c.statut}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/expert/editor/${c.id_unique}`}>
                            <Button variant="ghost" size="sm" className="text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                              <Eye className="h-4 w-4 mr-2" /> Voir
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