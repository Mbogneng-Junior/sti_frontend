// lib/api.ts

import { z } from "zod";

// Change l'URL de base pour pointer vers notre proxy d'API interne.
const API_BASE_URL = "/api/proxy";

// --- Schémas de validation avec Zod ---
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

const FiltersApiResponseSchema = z.object({
    genders: z.array(z.string()),
    professions: z.array(z.string()),
    symptoms: z.array(z.string()),
});


// --- Fonctions d'appel à l'API ---

/**
 * Récupère une liste de cas cliniques, potentiellement filtrée.
 * @param filters - Un objet contenant les filtres.
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

    const response = await fetch(`${API_BASE_URL}/cases?${params.toString()}`);
    
    if (!response.ok) {
        throw new Error(`Erreur réseau ou serveur: ${response.statusText}`);
    }

    const data = await response.json();

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
    const response = await fetch(`${API_BASE_URL}/filters`);
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
 */
export const getCaseById = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/cases/${id}`);

    if (!response.ok) {
        throw new Error(`Erreur réseau ou serveur: ${response.statusText}`);
    }
    
    const data = await response.json();

    const validatedData = CasCliniqueSchema.safeParse(data);
    if (!validatedData.success) {
        console.error("Erreur de validation Zod pour getCaseById:", validatedData.error);
        throw new Error("Les données reçues de l'API pour ce cas sont malformées.");
    }
    
    return validatedData.data;
};

/**
 * Déclenche une nouvelle extraction de données depuis la source Fultang.
 */
export const forceExtraction = async () => {
    const response = await fetch(`${API_BASE_URL}/extract/refresh`, {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error(`Erreur lors du déclenchement de l'extraction: ${response.statusText}`);
    }

    return await response.json();
};


// --- PLACEHOLDERS POUR LES APIS MANQUANTES ---
// TODO: Le backend doit implémenter ces endpoints

export const getExpertDashboardData = async () => {
    console.warn("API non implémentée: getExpertDashboardData");
    return {
      kpis: { pendingCases: 12, validatedCases: 45, studentSuccessRate: "68%" },
      cases: [
        { id: "cas-001", title: "Fièvre inexpliquée chez un voyageur", date: "2025-12-17T10:00:00Z", aiConfidence: 92 },
        { id: "cas-002", title: "Douleur abdominale aiguë post-opératoire", date: "2025-12-16T14:30:00Z", aiConfidence: 78 },
      ]
    };
};

export const updateCase = async (caseId: string, data: any) => {
    console.warn(`API non implémentée: updateCase pour l'ID ${caseId}`, data);
    return { status: "success", message: "Cas mis à jour (simulation)." };
};

export const publishCase = async (caseId: string) => {
    console.warn(`API non implémentée: publishCase pour l'ID ${caseId}`);
    return { status: "success", message: "Cas publié (simulation)." };
};

export const rejectCase = async (caseId: string) => {
    console.warn(`API non implémentée: rejectCase pour l'ID ${caseId}`);
    return { status: "success", message: "Cas rejeté (simulation)." };
};

export const getExpertProfile = async () => {
    console.warn("API non implémentée: getExpertProfile");
    return {
        specialty: "Médecine Interne, Maladies Tropicales",
        bio: "Expert en maladies infectieuses avec 15 ans d'expérience."
    };
};

export const updateExpertProfile = async (data: any) => {
    console.warn("API non implémentée: updateExpertProfile", data);
    return { status: "success", message: "Profil mis à jour (simulation)." };
};
