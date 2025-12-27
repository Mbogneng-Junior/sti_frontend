// lib/api.ts

const API_BASE_URL = "/api/proxy";

/**
 * Gère les réponses de l'API de manière robuste.
 */
const handleApiResponse = async (response: Response) => {
    if (response.status === 204) return {};
    if (!response.ok) {
        let errorMessage = `Erreur API: ${response.status} ${response.statusText}`;
        try {
            const errorData = await response.json();
            if (typeof errorData === 'object' && errorData !== null) {
                errorMessage = Object.entries(errorData)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                    .join('; ');
            }
        } catch (e) {}
        throw new Error(errorMessage);
    }
    try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }
        return {};
    } catch (e) {
        throw new Error("Réponse invalide du serveur.");
    }
};





















// Type pour un symptôme
type Symptom = {
    nom: string;
    degre: string | null;
    duree: string | null;
};

// Type pour un cas clinique de base (utilisé dans les listes)
type BaseClinicalCase = {
    id_unique: string;
    motif_consultation: string;
    donnees_personnelles: { age: number; sexe: string; };
    // CORRECTION : Le type Symptom est maintenant utilisé ici
    symptomes: Symptom[];
};

export const getCases = async (filters: any): Promise<BaseClinicalCase[]> => {
    console.warn("API non implémentée: getCases. Retour de données simulées.");
    return [];
};

export const getFilters = async () => {
    console.warn("API non implémentée: getFilters. Retour de données simulées.");
    return { genders: ["Homme", "Femme"], professions: [], symptoms: [] };
};

// Type pour un cas clinique détaillé
type DetailedClinicalCase = BaseClinicalCase & {
    hash_authentification: string;
    diagnostic_physique: { nom: string; resultat: string | null; }[];
    examens_complementaires: { nom: string; resultat: string | null; }[];
    traitement_en_cours: { nom: string; efficacite: string | null; }[];
};

export const getCaseById = async (id: string): Promise<DetailedClinicalCase> => {
    console.warn(`API non implémentée: getCaseById pour ${id}.`);
    return {
        id_unique: id, 
        hash_authentification: "simulated_hash_string", 
        motif_consultation: "Cas non trouvé (simulation)",
        donnees_personnelles: { age: 0, sexe: 'N/A' as const }, 
        symptomes: [], // Ce tableau est maintenant de type Symptom[] grâce au type DetailedClinicalCase
        diagnostic_physique: [],
        examens_complementaires: [],
        traitement_en_cours: [],
    };
};

// --- AUTHENTIFICATION ---
export const apprenantRegister = (data: any) => fetch(`${API_BASE_URL}/auth/register/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(handleApiResponse);
export const apprenantLogin = (data: any) => fetch(`${API_BASE_URL}/auth/login/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(handleApiResponse);
export const expertRegister = (data: any) => fetch(`${API_BASE_URL}/auth/expert/register/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(handleApiResponse);
export const expertLogin = (data: any) => fetch(`${API_BASE_URL}/auth/expert/login/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(handleApiResponse);
export const logout = (token: string) => fetch(`${API_BASE_URL}/auth/logout/`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` } }).then(handleApiResponse);

// --- SESSION DE TUTEUR & INTERFACE ---
export const startSession = (email_apprenant: string, domaine_nom: string, token: string) => fetch(`${API_BASE_URL}/tuteur/session/start/`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` }, body: JSON.stringify({ email_apprenant, domaine_nom }) }).then(handleApiResponse);
export const analyseResponse = (session_id: string, reponse_etudiant: string, token: string) => fetch(`${API_BASE_URL}/tuteur/session/analyser/`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` }, body: JSON.stringify({ session_id, reponse_etudiant }) }).then(handleApiResponse);
export const getSessionState = (session_id: string, token: string) => fetch(`${API_BASE_URL}/tuteur/session/${session_id}/state/`, { headers: { 'Authorization': `Token ${token}` } }).then(handleApiResponse);
export const getSessionsByDomain = async (apprenantId: string, domaineNom: string, token: string) => {
    const params = new URLSearchParams({ apprenant: apprenantId, 'cas_clinique__domaine__nom__iexact': domaineNom });
    const response = await fetch(`${API_BASE_URL}/interface/sessions/?${params.toString()}`, { headers: { 'Authorization': `Token ${token}` } });
    return handleApiResponse(response);
};
export const deleteSession = async (sessionId: string, token: string) => fetch(`${API_BASE_URL}/interface/sessions/${sessionId}/`, { method: 'DELETE', headers: { 'Authorization': `Token ${token}` } }).then(handleApiResponse);

// --- DONNÉES GÉNÉRALES ---
export const getDomaines = async () => fetch(`${API_BASE_URL}/expert/domaines/`).then(handleApiResponse);


// --- FONCTIONS "MODE EXPERT" (CORRIGÉES AVEC LES TYPES POUR ÉVITER LES ERREURS DE BUILD) ---



export const forceExtraction = async () => {
    console.warn("API non implémentée: forceExtraction. Simule un succès.");
    return { status: "success", message: "Extraction simulée lancée." };
};

// Type pour les données du dashboard
type DashboardData = {
    kpis: { pendingCases: number; validatedCases: number; studentSuccessRate: string; };
    cases: { id: string; title: string; date: string; aiConfidence: number; }[];
};

export const getExpertDashboardData = async (): Promise<DashboardData> => {
    console.warn("API non implémentée: getExpertDashboardData. Retour de données simulées.");
    // CORRECTION : On retourne un objet typé avec un tableau vide.
    return {
      kpis: { pendingCases: 0, validatedCases: 0, studentSuccessRate: "N/A" },
      cases: [],
    };
};

export const updateCase = async (caseId: string, data: any) => {
    console.warn(`API non implémentée: updateCase pour ${caseId}.`);
    return { status: "success", message: "Cas mis à jour (simulation)." };
};

export const publishCase = async (caseId: string) => {
    console.warn(`API non implémentée: publishCase pour ${caseId}.`);
    return { status: "success", message: "Cas publié (simulation)." };
};

export const rejectCase = async (caseId: string) => {
    console.warn(`API non implémentée: rejectCase pour ${caseId}.`);
    return { status: "success", message: "Cas rejeté (simulation)." };
};

export const getExpertProfile = async () => {
    console.warn("API non implémentée: getExpertProfile.");
    return { specialty: "Non défini", bio: "" };
};

export const updateExpertProfile = async (data: any) => {
    console.warn("API non implémentée: updateExpertProfile.");
    return { status: "success", message: "Profil mis à jour (simulation)." };
};