"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { getCases, getFilters } from "@/lib/api"; // Importer les deux fonctions

// Le type est maintenant inféré depuis la fonction getCases.
type ClinicalCase = Awaited<ReturnType<typeof getCases>>[number];

// Type pour les options de filtres venant de l'API
type FiltersState = {
    genders: string[];
    professions: string[];
    symptoms: string[];
};

const ExpertPage = () => {
    // --- États pour la recherche et les résultats ---
    const [results, setResults] = useState<ClinicalCase[]>([]);
    const [isLoading, setIsLoading] = useState(true); // true pour le chargement initial
    const [error, setError] = useState<string | null>(null);

    // --- États pour les champs de filtre ---
    const [keyword, setKeyword] = useState("");
    const [minAge, setMinAge] = useState("");
    const [maxAge, setMaxAge] = useState("");
    const [gender, setGender] = useState("");
    const [profession, setProfession] = useState("");
    const [symptom, setSymptom] = useState("");

    // --- État pour les options de filtre disponibles ---
    const [filtersOptions, setFiltersOptions] = useState<FiltersState>({
        genders: [],
        professions: [],
        symptoms: [],
    });

    // --- Chargement des options de filtre au montage ---
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const data = await getFilters();
                setFiltersOptions(data);
            } catch (e) {
                console.error("Impossible de charger les options de filtres:", e);
                // On peut choisir d'afficher une erreur ou non
            }
        };
        fetchFilters();
    }, []);

    // --- Fonction de recherche ---
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
            console.error("Erreur lors de la récupération des données:", e);
            setError(e.message || "Une erreur est survenue. Le backend est-il démarré ?");
        } finally {
            setIsLoading(false);
        }
    }, [keyword, minAge, maxAge, gender, profession, symptom]);

    // Chargement initial des données
    useEffect(() => {
        handleSearch();
    }, [handleSearch]);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Explorateur de Cas</h1>
                <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg bg-slate-50">
                {/* Ligne 1 */}
                <Input
                    placeholder="Mot-clé (ex: Paludisme)"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="md:col-span-2"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Input
                    type="number"
                    placeholder="Âge min"
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Input
                    type="number"
                    placeholder="Âge max"
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />

                {/* Ligne 2 : Nouveaux filtres */}
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-2 border rounded-md bg-white">
                    <option value="">Tout sexe</option>
                    {filtersOptions.genders.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                
                <select value={profession} onChange={(e) => setProfession(e.target.value)} className="w-full p-2 border rounded-md bg-white lg:col-span-2">
                    <option value="">Toute profession</option>
                    {filtersOptions.professions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>

                <select value={symptom} onChange={(e) => setSymptom(e.target.value)} className="w-full p-2 border rounded-md bg-white">
                    <option value="">Tout symptôme</option>
                    {filtersOptions.symptoms.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div className="flex justify-end mb-8">
                <Button onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Recherche...
                        </>
                    ) : "Rechercher"}
                </Button>
            </div>

            <div className="space-y-4">
                {error && <p className="text-red-500 text-center">{error}</p>}
                
                {isLoading && (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="h-8 w-8 text-slate-500 animate-spin" />
                        <p className="ml-3">Chargement des cas cliniques...</p>
                    </div>
                )}

                {!isLoading && !error && results.length === 0 && (
                    <p className="text-center text-muted-foreground pt-10">
                        Aucun cas ne correspond à votre recherche.
                    </p>
                )}

                {!isLoading && results.length > 0 && results.map((cas) => (
                    <Link href={`/expert/${cas.id_unique}`} key={cas.id_unique}>
                        <div className="p-4 border rounded-lg hover:bg-slate-50 active:bg-slate-100 transition cursor-pointer">
                            <h3 className="font-semibold text-green-600">{cas.motif_consultation}</h3>
                            <p className="text-sm text-muted-foreground">
                                ID: {cas.id_unique} | Patient: {cas.donnees_personnelles.age} ans, {cas.donnees_personnelles.sexe}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {cas.symptomes.slice(0, 3).map(s => (
                                    <span key={s.nom} className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">{s.nom}</span>
                                ))}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ExpertPage;
