"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Eye
} from "lucide-react";
import Link from "next/link";

// Donnees statiques pour le moment (sera remplace par des appels API)
const expertsData = [
  {
    id: "1",
    nom: "Dr. Jean Kamga",
    email: "j.kamga@hospital.cm",
    specialite: "Cardiologie",
    status: "actif",
    casTraites: 45,
    dateCreation: "2024-01-15"
  },
  {
    id: "2",
    nom: "Dr. Marie Ngo",
    email: "m.ngo@hospital.cm",
    specialite: "Medecine Generale",
    status: "actif",
    casTraites: 78,
    dateCreation: "2024-02-20"
  },
  {
    id: "3",
    nom: "Dr. Paul Mbarga",
    email: "p.mbarga@hospital.cm",
    specialite: "Urgences",
    status: "inactif",
    casTraites: 23,
    dateCreation: "2024-03-10"
  },
  {
    id: "4",
    nom: "Dr. Sophie Fotso",
    email: "s.fotso@hospital.cm",
    specialite: "Pneumologie",
    status: "actif",
    casTraites: 56,
    dateCreation: "2024-01-28"
  },
  {
    id: "5",
    nom: "Dr. Emmanuel Tabi",
    email: "e.tabi@hospital.cm",
    specialite: "Medecine Interne",
    status: "actif",
    casTraites: 112,
    dateCreation: "2023-11-05"
  },
];

const specialites = [
  "Toutes",
  "Medecine Generale",
  "Urgences",
  "Medecine Interne",
  "Pneumologie",
  "Cardiologie",
  "Endocrinologie",
  "Urologie",
];

export default function ExpertsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialite, setSelectedSpecialite] = useState("Toutes");
  const [selectedStatus, setSelectedStatus] = useState("tous");

  // Filtrage des experts
  const filteredExperts = expertsData.filter((expert) => {
    const matchesSearch =
      expert.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialite =
      selectedSpecialite === "Toutes" || expert.specialite === selectedSpecialite;
    const matchesStatus =
      selectedStatus === "tous" || expert.status === selectedStatus;

    return matchesSearch && matchesSpecialite && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Experts</h1>
          <p className="text-gray-500 mt-1">
            {filteredExperts.length} expert(s) enregistre(s)
          </p>
        </div>
        <Link href="/admin/experts/add">
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Ajouter un Expert
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Specialite Filter */}
            <Select value={selectedSpecialite} onValueChange={setSelectedSpecialite}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Specialite" />
              </SelectTrigger>
              <SelectContent>
                {specialites.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous</SelectItem>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="inactif">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Expert</TableHead>
                <TableHead className="font-semibold">Specialite</TableHead>
                <TableHead className="font-semibold">Cas Traites</TableHead>
                <TableHead className="font-semibold">Statut</TableHead>
                <TableHead className="font-semibold">Date Creation</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExperts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Aucun expert trouve
                  </TableCell>
                </TableRow>
              ) : (
                filteredExperts.map((expert) => (
                  <TableRow key={expert.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold text-sm">
                            {expert.nom.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{expert.nom}</p>
                          <p className="text-sm text-gray-500">{expert.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium">
                        {expert.specialite}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{expert.casTraites}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        expert.status === 'actif'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {expert.status === 'actif' ? 'Actif' : 'Inactif'}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {new Date(expert.dateCreation).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" />
                            Voir le profil
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Mail className="h-4 w-4" />
                            Envoyer un email
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-red-600">
                            <Trash2 className="h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
