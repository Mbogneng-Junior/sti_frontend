"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Loader2,
  Filter,
  User,
  Stethoscope,
  ChevronRight,
  FileSearch,
  X,
  SlidersHorizontal
} from "lucide-react";
import { getCases, getFilters } from "@/lib/api";

type ClinicalCase = Awaited<ReturnType<typeof getCases>>[number];

type FiltersState = {
  genders: string[];
  professions: string[];
  symptoms: string[];
};

const ExpertPage = () => {
  const [results, setResults] = useState<ClinicalCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [keyword, setKeyword] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [gender, setGender] = useState("");
  const [profession, setProfession] = useState("");
  const [symptom, setSymptom] = useState("");

  const [filtersOptions, setFiltersOptions] = useState<FiltersState>({
    genders: [],
    professions: [],
    symptoms: [],
  });

  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await getFilters();
        setFiltersOptions(data);
      } catch (e) {
        console.error("Impossible de charger les options de filtres:", e);
      }
    };
    fetchFilters();
  }, []);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getCases({
        keyword: keyword,
        min_age: minAge,
        max_age: maxAge,
        gender: gender,
        profession: profession,
        symptom: symptom,
      });
      setResults(data);
    } catch (e: any) {
      console.error("Erreur lors de la recuperation des donnees:", e);
      setError(e.message || "Une erreur est survenue. Le backend est-il demarre ?");
    } finally {
      setIsLoading(false);
    }
  }, [keyword, minAge, maxAge, gender, profession, symptom]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const clearFilters = () => {
    setKeyword("");
    setMinAge("");
    setMaxAge("");
    setGender("");
    setProfession("");
    setSymptom("");
  };

  const hasActiveFilters = keyword || minAge || maxAge || gender || profession || symptom;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <FileSearch className="h-8 w-8 text-primary" />
              Explorateur de Cas
            </h1>
            <p className="text-muted-foreground mt-1">
              Recherchez et consultez les cas cliniques disponibles
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {results.length} cas trouves
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? "Masquer filtres" : "Afficher filtres"}
            </Button>
          </div>
        </div>

        {/* Filters Card */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Filtres de recherche</CardTitle>
                </div>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
                    <X className="h-4 w-4" />
                    Effacer
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Keyword Search */}
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par mot-cle (ex: Paludisme, Fievre...)"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="pl-10"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>

                {/* Age Range */}
                <Input
                  type="number"
                  placeholder="Age minimum"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Input
                  type="number"
                  placeholder="Age maximum"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />

                {/* Selects */}
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les sexes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les sexes</SelectItem>
                    {filtersOptions.genders.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={profession} onValueChange={setProfession}>
                  <SelectTrigger className="lg:col-span-2">
                    <SelectValue placeholder="Toutes les professions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les professions</SelectItem>
                    {filtersOptions.professions.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={symptom} onValueChange={setSymptom}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les symptomes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les symptomes</SelectItem>
                    {filtersOptions.symptoms.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={handleSearch} disabled={isLoading} className="gap-2">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  {isLoading ? "Recherche..." : "Rechercher"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <div className="space-y-4">
          {error && (
            <Card className="border-destructive">
              <CardContent className="p-6">
                <p className="text-destructive text-center">{error}</p>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && !error && results.length === 0 && (
            <Card>
              <CardContent className="p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-muted p-4 mb-4">
                    <FileSearch className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium text-muted-foreground">
                    Aucun cas ne correspond a votre recherche
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Essayez de modifier vos criteres de recherche
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {!isLoading && results.length > 0 && results.map((cas) => (
            <Link href={`/expert/${cas.id_unique}`} key={cas.id_unique}>
              <Card className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div>
                        <h3 className="text-lg font-semibold text-primary group-hover:underline">
                          {cas.motif_consultation}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {cas.donnees_personnelles.age} ans, {cas.donnees_personnelles.sexe}
                          </span>
                          <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                            ID: {cas.id_unique}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {cas.symptomes.slice(0, 4).map((s) => (
                          <Badge
                            key={s.nom}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <Stethoscope className="h-3 w-3" />
                            {s.nom}
                          </Badge>
                        ))}
                        {cas.symptomes.length > 4 && (
                          <Badge variant="outline">
                            +{cas.symptomes.length - 4} autres
                          </Badge>
                        )}
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpertPage;
