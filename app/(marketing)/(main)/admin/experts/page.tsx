"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UserPlus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Eye,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { getExperts, getDomaines } from "@/lib/api";

export default function ExpertsListPage() {
  const [experts, setExperts] = useState<any[]>([]);
  const [domaines, setDomaines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialite, setSelectedSpecialite] = useState("Toutes");

  // 1. Charger les données réelles
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [expertsData, domainesData] = await Promise.all([
          getExperts(),
          getDomaines()
        ]);
        setExperts(expertsData);
        setDomaines(domainesData);
      } catch (error) {
        console.error("Erreur chargement experts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Logique de filtrage sur les données réelles
  const filteredExperts = experts.filter((expert) => {
    const nomExpert = expert.nom || "";
    const emailExpert = expert.email || "";
    const specialiteExpert = expert.domaine_expertise_nom || "Général";

    const matchesSearch =
      nomExpert.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emailExpert.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialite =
      selectedSpecialite === "Toutes" || specialiteExpert === selectedSpecialite;

    return matchesSearch && matchesSpecialite;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Experts</h1>
          <p className="text-gray-500 mt-1">
            {isLoading ? "Chargement..." : `${filteredExperts.length} expert(s) enregistré(s)`}
          </p>
        </div>
        <Link href="/admin/experts/add">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4" />
            Ajouter un Expert
          </Button>
        </Link>
      </div>

      {/* Barre de Filtres */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedSpecialite} onValueChange={setSelectedSpecialite}>
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Spécialité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Toutes">Toutes les spécialités</SelectItem>
                {domaines.map((spec: any) => (
                  <SelectItem key={spec.id} value={spec.nom}>
                    {spec.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des Experts */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Récupération de la liste...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="font-semibold">Expert</TableHead>
                  <TableHead className="font-semibold">Spécialité</TableHead>
                  <TableHead className="font-semibold">Matricule</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExperts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-gray-500 italic">
                      Aucun expert trouvé dans la base de données.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExperts.map((expert) => (
                    <TableRow key={expert.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {expert.nom?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{expert.nom}</p>
                            <p className="text-xs text-gray-500">{expert.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-0">
                          {expert.domaine_expertise_nom || "Général"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-500">
                        {expert.matricule || "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Eye className="h-4 w-4" /> Voir le profil
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer text-red-600">
                              <Trash2 className="h-4 w-4" /> Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
  );
}