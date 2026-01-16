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

// Type pour le statut d'un cas clinique
export type CaseStatus = "attente" | "validé" | "rejeté";

// Type pour un cas clinique dans le dashboard expert
export type ExpertCaseData = {
    id: string;
    patientAge: number;
    gender: "Male" | "Female";
    domain: string;
    extractionDate: string;
    status: CaseStatus;
};

// Type pour les données du dashboard
export type DashboardData = {
    kpis: { 
        totalCases: number; 
        pendingCases: number; 
        validatedCases: number;
        trendTotal?: { value: number; period: string; };
        trendPending?: { value: number; period: string; };
        trendValidated?: { value: number; period: string; };
    };
    cases: ExpertCaseData[];
};

export const getExpertDashboardData = async (): Promise<DashboardData> => {
    console.warn("API non implémentée: getExpertDashboardData. Retour de données simulées.");
    
    // Données simulées réalistes
    return {
      kpis: { 
        totalCases: 1248,
        pendingCases: 42, 
        validatedCases: 1150,
        trendTotal: { value: 12, period: "depuis le mois dernier" },
        trendPending: { value: 8, period: "cette semaine" },
        trendValidated: { value: 8, period: "cette semaine" },
      },
      cases: [
        {
          id: "CASE-8842",
          patientAge: 45,
          gender: "Male",
          domain: "Cardiologie",
          extractionDate: "2023-10-24",
          status: "attente"
        },
        {
          id: "CASE-9120",
          patientAge: 62,
          gender: "Female",
          domain: "Neurologie",
          extractionDate: "2023-10-23",
          status: "attente"
        },
        {
          id: "CASE-7751",
          patientAge: 28,
          gender: "Female",
          domain: "Dermatologie",
          extractionDate: "2023-10-22",
          status: "validé"
        },
        {
          id: "CASE-7554",
          patientAge: 55,
          gender: "Male",
          domain: "Cardiologie",
          extractionDate: "2023-10-20",
          status: "validé"
        },
        {
          id: "CASE-6001",
          patientAge: 19,
          gender: "Male",
          domain: "Pédiatrie",
          extractionDate: "2023-10-19",
          status: "rejeté"
        },
        {
          id: "CASE-9331",
          patientAge: 33,
          gender: "Female",
          domain: "Oncologie",
          extractionDate: "2023-10-18",
          status: "attente"
        },
        {
          id: "CASE-4122",
          patientAge: 71,
          gender: "Male",
          domain: "Gériatrie",
          extractionDate: "2023-10-18",
          status: "validé"
        },
      ],
    };
};

export const updateCase = async (caseId: string, data: any) => {
    console.warn(`API non implémentée: updateCase pour ${caseId}.`);
    return { status: "success", message: "Cas mis à jour (simulation)." };
};

export const validateCase = async (caseId: string) => {
    console.warn(`API non implémentée: validateCase pour ${caseId}.`);
    return { status: "success", message: "Cas validé avec succès." };
};

export const publishCase = async (caseId: string) => {
    console.warn(`API non implémentée: publishCase pour ${caseId}.`);
    return { status: "success", message: "Cas publié (simulation)." };
};

export const rejectCase = async (caseId: string) => {
    console.warn(`API non implémentée: rejectCase pour ${caseId}.`);
    return { status: "success", message: "Cas rejeté avec succès." };
};

// Type pour les détails complets d'un cas clinique pour la page de révision
export type CaseReviewData = {
    id: string;
    title: string;
    status: CaseStatus;
    createdDate: string;
    patientInfo: {
        gender: "Male" | "Female";
        age: number;
        bmi: number;
        patientId: string;
    };
    patientHistory: string;
    pastMedicalHistory: string[];
    laboratoryResults: {
        testName: string;
        result: string;
        referenceRange: string;
        status: "High" | "Normal" | "Elevated";
    }[];
};

export const getCaseForReview = async (caseId: string): Promise<CaseReviewData> => {
    console.warn(`API non implémentée: getCaseForReview pour ${caseId}.`);
    
    // Données simulées basées sur la capture d'écran
    return {
        id: caseId,
        title: "Infarctus du myocarde aigu",
        status: "attente",
        createdDate: "2023-10-24",
        patientInfo: {
            gender: "Male",
            age: 64,
            bmi: 28.4,
            patientId: "#48291"
        },
        patientHistory: "Le patient s'est présenté au service des urgences avec une douleur thoracique sévère et écrasante irradiant vers le bras gauche et la mâchoire. La douleur a commencé il y a environ 45 minutes avant l'arrivée alors que le patient jardinait. Il décrit la douleur comme 9/10 en gravité.\n\nLes symptômes associés incluent la diaphorèse, l'essoufflement et les nausées. Il nie tout traumatisme récent, fièvre ou épisode similaire dans le passé, bien qu'il note une \"indigestion occasionnelle\" avec effort au cours du dernier mois.",
        pastMedicalHistory: [
            "Hypertension (diagnostiquée en 2015)",
            "Diabète de type 2 (non contrôlé)",
            "Ancien fumeur (il y a 10 ans)"
        ],
        laboratoryResults: [
            {
                testName: "Troponine T",
                result: "0.8 ng/mL",
                referenceRange: "< 0.01 ng/mL",
                status: "High"
            },
            {
                testName: "CK-MB",
                result: "32 ng/mL",
                referenceRange: "0 - 5 ng/mL",
                status: "High"
            },
            {
                testName: "Numération des GB",
                result: "11.5 K/µL",
                referenceRange: "4.5 - 11.0 K/µL",
                status: "Elevated"
            },
            {
                testName: "Hémoglobine",
                result: "14.2 g/dL",
                referenceRange: "13.5 - 17.5 g/dL",
                status: "Normal"
            }
        ]
    };
};

export const getExpertProfile = async () => {
    console.warn("API non implémentée: getExpertProfile.");
    return { specialty: "Non défini", bio: "" };
};

export const updateExpertProfile = async (data: any) => {
    console.warn("API non implémentée: updateExpertProfile.");
    return { status: "success", message: "Profil mis à jour (simulation)." };
};