// lib/api.ts

import { z } from "zod";

// L'URL de base de notre API backend. 
// Pour le développement, c'est le port 8000.
// À l'avenir, on pourra le remplacer par une variable d'environnement.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// --- Schémas de validation avec Zod (optionnel mais robuste) ---
// Ceci garantit que les données reçues de l'API ont la forme attendue.

const DonneesPersonnellesSchema = z.object({
  age: z.number(),
  sexe: z.string(),
  profession: z.string().optional().nullable(),
  etat_civil: z.string().optional().nullable(),
});

const CasCliniqueSchema = z.object({
  id_unique: z.string(),
  hash_authentification: z.string(),
  motif_consultation: z.string(),
  donnees_personnelles: DonneesPersonnellesSchema,
  symptomes: z.array(z.object({ nom: z.string(), degre: z.string().optional().nullable(), duree: z.string().optional().nullable() })),
  diagnostic_physique: z.array(z.object({ nom: z.string(), resultat: z.string().optional().nullable() })),
  examens_complementaires: z.array(z.object({ nom: z.string(), resultat: z.string().optional().nullable() })),
  traitement_en_cours: z.array(z.object({ nom: z.string(), efficacite: z.string().optional().nullable() })),
});

const CasesApiResponseSchema = z.array(CasCliniqueSchema);

// Schéma pour la réponse de l'API des filtres
const FiltersApiResponseSchema = z.object({
    genders: z.array(z.string()),
    professions: z.array(z.string()),
    symptoms: z.array(z.string()),
});


// --- Fonctions d'appel à l'API ---

/**
 * Récupère une liste de cas cliniques, potentiellement filtrée.
 * @param filters - Un objet contenant les filtres (keyword, min_age, max_age).
 */
export const getCases = async (filters: { 
    keyword?: string; 
    min_age?: string; 
    max_age?: string; 
    gender?: string;
    profession?: string;
    symptom?: string;
}) => {
    const params = new URLSearchParams();
    if (filters.keyword) params.append("keyword", filters.keyword);
    if (filters.min_age) params.append("min_age", filters.min_age);
    if (filters.max_age) params.append("max_age", filters.max_age);
    if (filters.gender) params.append("gender", filters.gender);
    if (filters.profession) params.append("profession", filters.profession);
    if (filters.symptom) params.append("symptom", filters.symptom);

    const response = await fetch(`${API_BASE_URL}/api/cases?${params.toString()}`);
    
    if (!response.ok) {
        throw new Error(`Erreur réseau ou serveur: ${response.statusText}`);
    }

    const data = await response.json();

    // Valider les données reçues avec Zod
    const validatedData = CasesApiResponseSchema.safeParse(data);
    if (!validatedData.success) {
        console.error("Erreur de validation Zod:", validatedData.error);
        throw new Error("Les données reçues de l'API sont malformées.");
    }

    return validatedData.data;
};

/**
 * Récupère les filtres disponibles depuis l'API.
 */
export const getFilters = async () => {
    const response = await fetch(`${API_BASE_URL}/api/filters`);
    if (!response.ok) {
        throw new Error(`Erreur réseau ou serveur: ${response.statusText}`);
    }
    const data = await response.json();
    const validatedData = FiltersApiResponseSchema.safeParse(data);
    if (!validatedData.success) {
        console.error("Erreur de validation Zod pour getFilters:", validatedData.error);
        throw new Error("Les données de filtres reçues de l'API sont malformées.");
    }
    return validatedData.data;
};

/**
 * Récupère les détails complets d'un cas clinique par son ID.
 * @param id - L'ID unique du cas clinique.
 */
export const getCaseById = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/cases/${id}`);

    if (!response.ok) {
        throw new Error(`Erreur réseau ou serveur: ${response.statusText}`);
    }
    
    const data = await response.json();

    // Valider les données
    const validatedData = CasCliniqueSchema.safeParse(data);
    if (!validatedData.success) {
        console.error("Erreur de validation Zod pour getCaseById:", validatedData.error);
        throw new Error("Les données reçues de l'API pour ce cas sont malformées.");
    }
    
    return validatedData.data;
};

// On pourrait aussi ajouter une fonction pour le mode 'learning' si besoin.
