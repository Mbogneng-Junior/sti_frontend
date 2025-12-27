// lib/api.ts

const API_BASE_URL = "/api/proxy";

/**
 * Gère les réponses de l'API de manière robuste, en incluant le cas des réponses 204.
 * @param response L'objet Response de l'appel fetch.
 */
const handleApiResponse = async (response: Response) => {
    // --- CORRECTION MAJEURE ---
    // 1. On gère d'abord le cas de succès "204 No Content".
    // C'est une réponse de succès qui n'a pas de corps, donc on retourne simplement un objet vide.
    if (response.status === 204) {
        return {};
    }

    // 2. On gère ensuite tous les cas d'erreur (status 4xx, 5xx).
    if (!response.ok) {
        let errorMessage = `Erreur API: ${response.status} ${response.statusText}`;
        try {
            const errorData = await response.json();
            if (typeof errorData === 'object' && errorData !== null) {
                errorMessage = Object.entries(errorData)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                    .join('; ');
            }
        } catch (e) {
            // Le corps de l'erreur n'est pas du JSON, on garde le message de base.
        }
        throw new Error(errorMessage);
    }

    // 3. Enfin, on gère les cas de succès qui ont un corps (200, 201, etc.).
    try {
        // On s'assure qu'il y a bien du JSON avant de le parser.
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }
        return {}; // Si pas de JSON, on retourne un objet vide.
    } catch (e) {
        console.error("La réponse du serveur était attendue en JSON mais n'a pas pu être parsée.", e);
        throw new Error("Réponse invalide du serveur.");
    }
};


// --- AUTHENTIFICATION ---
// Les fonctions ci-dessous sont maintenant robustes grâce au nouveau handleApiResponse.

export const apprenantRegister = (data: any) => {
    return fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(handleApiResponse);
};

export const apprenantLogin = (data: any) => {
    return fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(handleApiResponse);
};

export const expertRegister = (data: any) => {
    return fetch(`${API_BASE_URL}/auth/expert/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(handleApiResponse);
};

export const expertLogin = (data: any) => {
    return fetch(`${API_BASE_URL}/auth/expert/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(handleApiResponse);
};

export const logout = (token: string) => {
    return fetch(`${API_BASE_URL}/auth/logout/`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    }).then(handleApiResponse);
};


// --- SESSION DE TUTEUR ---

export const startSession = (email_apprenant: string, domaine_nom: string, token: string) => {
    return fetch(`${API_BASE_URL}/tuteur/session/start/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ email_apprenant, domaine_nom }),
    }).then(handleApiResponse);
};

export const analyseResponse = (session_id: string, reponse_etudiant: string, token: string) => {
    return fetch(`${API_BASE_URL}/tuteur/session/analyser/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ session_id, reponse_etudiant }),
    }).then(handleApiResponse);
};

export const getSessionState = (session_id: string, token: string) => {
    return fetch(`${API_BASE_URL}/tuteur/session/${session_id}/state/`, {
        headers: { 'Authorization': `Token ${token}` },
    }).then(handleApiResponse);
};


// --- DONNÉES GÉNÉRALES ---

export const getDomaines = async () => {
    const response = await fetch(`${API_BASE_URL}/expert/domaines/`);
    return handleApiResponse(response);
};