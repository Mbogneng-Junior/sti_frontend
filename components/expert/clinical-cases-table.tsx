"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { type ExpertCaseData, type CaseStatus } from "@/lib/api";

type Props = {
  cases: ExpertCaseData[];
  onReview: (caseId: string) => void;
  onViewDetails: (caseId: string) => void;
};

const getStatusBadge = (status: CaseStatus) => {
  switch (status) {
    case "attente":
      return (
        <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100 border-0 font-medium">
          ⭐ En attente
        </Badge>
      );
    case "validé":
      return (
        <Badge className="bg-green-100 text-green-600 hover:bg-green-100 border-0 font-medium">
          ✓ Validé
        </Badge>
      );
    case "rejeté":
      return (
        <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-0 font-medium">
          ✕ Rejeté
        </Badge>
      );
  }
};

export const ClinicalCasesTable = ({ cases, onReview, onViewDetails }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [domainFilter, setDomainFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const uniqueDomains = useMemo(() => {
    const domains = new Set(cases.map(c => c.domain));
    return Array.from(domains).sort();
  }, [cases]);

  const filteredCases = useMemo(() => {
    return cases.filter(caseItem => {
      const matchesSearch = 
        searchQuery === "" ||
        caseItem.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.domain.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAge = 
        ageFilter === "all" ||
        (ageFilter === "0-18" && caseItem.patientAge <= 18) ||
        (ageFilter === "19-40" && caseItem.patientAge >= 19 && caseItem.patientAge <= 40) ||
        (ageFilter === "41-60" && caseItem.patientAge >= 41 && caseItem.patientAge <= 60) ||
        (ageFilter === "61+" && caseItem.patientAge >= 61);

      const matchesGender = 
        genderFilter === "all" ||
        caseItem.gender.toLowerCase() === genderFilter.toLowerCase();

      const matchesDomain = 
        domainFilter === "all" ||
        caseItem.domain === domainFilter;

      return matchesSearch && matchesAge && matchesGender && matchesDomain;
    });
  }, [cases, searchQuery, ageFilter, genderFilter, domainFilter]);

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleReset = () => {
    setSearchQuery("");
    setAgeFilter("all");
    setGenderFilter("all");
    setDomainFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 bg-white p-5 rounded-xl shadow-[0_2px_15px_rgb(0,0,0,0.08)]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par ID de cas, maladie ou mots-clés"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 rounded-lg shadow-sm transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtres:</span>
          </div>

          <Select value={ageFilter} onValueChange={setAgeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tous les âges" />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectItem value="all">Tous les âges</SelectItem>
              <SelectItem value="0-18">0-18</SelectItem>
              <SelectItem value="19-40">19-40</SelectItem>
              <SelectItem value="41-60">41-60</SelectItem>
              <SelectItem value="61+">61+</SelectItem>
            </SelectContent>
          </Select>

          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sexe" />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectItem value="all">Sexe: Tous</SelectItem>
              <SelectItem value="male">Homme</SelectItem>
              <SelectItem value="female">Femme</SelectItem>
            </SelectContent>
          </Select>

          <Select value={domainFilter} onValueChange={setDomainFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Tous les domaines" />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectItem value="all">Tous les domaines</SelectItem>
              {uniqueDomains.map(domain => (
                <SelectItem key={domain} value={domain}>
                  {domain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            Réinitialiser
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_15px_rgb(0,0,0,0.08)] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wide">ID DU CAS</TableHead>
              <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wide">ÂGE PATIENT</TableHead>
              <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wide">SEXE</TableHead>
              <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wide">DOMAINE MALADIE</TableHead>
              <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wide">DATE EXTRACTION</TableHead>
              <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wide">STATUT</TableHead>
              <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wide text-right">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                  Aucun cas trouvé avec les filtres actuels
                </TableCell>
              </TableRow>
            ) : (
              paginatedCases.map((caseItem) => (
                <TableRow key={caseItem.id} className="hover:bg-gray-50 border-b border-gray-100">
                  <TableCell className="font-medium text-gray-900">
                    #{caseItem.id}
                  </TableCell>
                  <TableCell className="text-gray-700">{caseItem.patientAge}</TableCell>
                  <TableCell className="text-gray-700">
                    {caseItem.gender === "Male" ? "Homme" : "Femme"}
                  </TableCell>
                  <TableCell className="text-gray-700">{caseItem.domain}</TableCell>
                  <TableCell className="text-gray-700">
                    {new Date(caseItem.extractionDate).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>{getStatusBadge(caseItem.status)}</TableCell>
                  <TableCell className="text-right">
                    {caseItem.status === "attente" ? (
                      <Button 
                        size="sm" 
                        onClick={() => onReview(caseItem.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                      >
                        Examiner
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => onViewDetails(caseItem.id)}
                        className="text-gray-700 hover:bg-gray-100"
                      >
                        Voir détails
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_15px_rgb(0,0,0,0.08)] px-6 py-4 mt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">
            Affichage de <span className="font-semibold text-gray-900">{((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredCases.length)}</span> sur <span className="font-semibold text-gray-900">{filteredCases.length}</span> cas
          </p>
          <div className="flex items-center gap-2">
            {/* Bouton Précédent */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed h-9 px-3"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Précédent
            </Button>

            {/* Numéros de page */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page 
                    ? "bg-blue-600 hover:bg-blue-700 text-white min-w-[36px] h-9" 
                    : "text-gray-700 hover:bg-gray-100 min-w-[36px] h-9"
                  }
                >
                  {page}
                </Button>
              ))}
            </div>

            {/* Bouton Suivant */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed h-9 px-3"
            >
              Suivant
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
