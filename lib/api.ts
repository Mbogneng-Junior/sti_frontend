// lib/api.ts

const API_BASE_URL = "/api/proxy";

/**
 * Gère les réponses de l'API de manière robuste, en incluant le cas des réponses 204.
 */
const handleApiResponse = async (response: Response) => {
    if (response.status === 204) return {}; // Succès sans contenu (pour DELETE, logout)
    
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


// --- AUTHENTIFICATION ---

export const apprenantRegister = (data: any) => fetch(`${API_BASE_URL}/auth/register/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(handleApiResponse);
export const apprenantLogin = (data: any) => fetch(`${API_BASE_URL}/auth/login/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(handleApiResponse);
export const expertRegister = (data: any) => fetch(`${API_BASE_URL}/auth/expert/register/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(handleApiResponse);
export const expertLogin = (data: any) => fetch(`${API_BASE_URL}/auth/expert/login/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(handleApiResponse);
export const logout = (token: string) => fetch(`${API_BASE_URL}/auth/logout/`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` } }).then(handleApiResponse);


// --- SESSION DE TUTEUR & INTERFACE ---

export const startSession = (email_apprenant: string, domaine_nom: string, token: string) => {
    return fetch(`${API_BASE_URL}/tuteur/session/start/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        body: JSON.stringify({ email_apprenant, domaine_nom }),
    }).then(handleApiResponse);
};

export const analyseResponse = (session_id: string, reponse_etudiant: string, token: string) => {
    return fetch(`${API_BASE_URL}/tuteur/session/analyser/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        body: JSON.stringify({ session_id, reponse_etudiant }),
    }).then(handleApiResponse);
};

export const getSessionState = (session_id: string, token: string) => {
    return fetch(`${API_BASE_URL}/tuteur/session/${session_id}/state/`, {
        headers: { 'Authorization': `Token ${token}` },
    }).then(handleApiResponse);
};

export const getSessionsByDomain = async (apprenantId: string, domaineNom: string, token: string) => {
    const params = new URLSearchParams({
        apprenant: apprenantId,
        'cas_clinique__domaine__nom__iexact': domaineNom,
    });
    const response = await fetch(`${API_BASE_URL}/interface/sessions/?${params.toString()}`, {
        headers: { 'Authorization': `Token ${token}` },
    });
    return handleApiResponse(response);
};

export const deleteSession = async (sessionId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/interface/sessions/${sessionId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` },
    });
    return handleApiResponse(response); // Gérera le 204 No Content
};


// --- DONNÉES GÉNÉRALES ---

export const getDomaines = async () => {
    return fetch(`${API_BASE_URL}/expert/domaines/`).then(handleApiResponse);
};


// --- FONCTIONS "MODE EXPERT" (SIMULATIONS) ---

export const getCases = async (filters: any) => { console.warn("API non implémentée: getCases"); return []; };
export const getFilters = async () => { console.warn("API non implémentée: getFilters"); return { genders: ["Homme", "Femme"], professions: [], symptoms: [] }; };
export const getCaseById = async (id: string) => { console.warn(`API non implémentée: getCaseById pour ${id}`); return { id_unique: id, hash_authentification: "", motif_consultation: "Cas non trouvé (simulation)", donnees_personnelles: { age: 0, sexe: 'N/A' }, symptomes: [], diagnostic_physique: [], examens_complementaires: [], traitement_en_cours: [] }; };
export const forceExtraction = async () => { console.warn("API non implémentée: forceExtraction"); return { status: "success", message: "Extraction simulée lancée." }; };
export const getExpertDashboardData = async () => { console.warn("API non implémentée: getExpertDashboardData"); return { kpis: { pendingCases: 0, validatedCases: 0, studentSuccessRate: "N/A" }, cases: [] }; };
export const updateCase = async (caseId: string, data: any) => { console.warn(`API non implémentée: updateCase pour ${caseId}`); return { status: "success", message: "Cas mis à jour (simulation)." }; };
export const publishCase = async (caseId: string) => { console.warn(`API non implémentée: publishCase pour ${caseId}`); return { status: "success", message: "Cas publié (simulation)." }; };
export const rejectCase = async (caseId: string) => { console.warn(`API non implémentée: rejectCase pour ${caseId}`); return { status: "success", message: "Cas rejeté (simulation)." }; };
export const getExpertProfile = async () => { console.warn("API non implémentée: getExpertProfile"); return { specialty: "Non défini", bio: "" }; };
export const updateExpertProfile = async (data: any) => { console.warn("API non implémentée: updateExpertProfile"); return { status: "success", message: "Profil mis à jour (simulation)." }; };