// lib/api.ts
// Connexion au backend FastAPI pour les cas cliniques

const API_BASE_URL = "http://localhost:8000";

/**
 * Gets authorization headers with token if available
 */
const getAuthHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };
    
    // Check if we are in the browser
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
    }
    
    return headers;
};

// --- Student Dashboard Types ---
export interface ProficiencyItem {
  id: string;
  label: string;
  value: number;
  color: string;
  bgColor: string;
  description: string;
}

export interface StudentStats {
  cas_completes: number;
  score_moyen: number;
  temps_etude: number;
  jours_consecutifs: number;
}

export interface StudentDashboardData {
  global_stats: StudentStats;
  proficiency_data: ProficiencyItem[];
}

export const getStudentDashboardStats = async (): Promise<StudentDashboardData> => {
  const res = await fetch(`${API_BASE_URL}/api/v1/apprenant/dashboard/stats/`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Erreur chargement dashboard");
  return res.json();
};

export interface Badge {
  id: number;
  nom: string;
  description: string;
  icon?: string;
}

export interface CompetenceLevel {
  id: number;
  domaine_nom: string;
  niveau_actuel: string;
  score_anamnese: number;
  score_diagnostic: number;
  score_traitement: number;
  score_relationnel: number;
  progression_globale: number;
}

export interface FullProfileData {
  apprenant: {
    id: string;
    nom: string;
    email: string;
    date_inscription: string;
  };
  profil: {
    xp_total: number;
    lacunes_identifiees: string[];
    badges: Badge[];
    est_profile: boolean;
  };
  competences: CompetenceLevel[];
}

export const getStudentFullProfile = async (): Promise<FullProfileData> => {
   const res = await fetch(`${API_BASE_URL}/api/v1/apprenant/dashboard/full_profile/`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Erreur chargement profil");
  return res.json();
};

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
                if (errorData.detail) {
                    errorMessage = errorData.detail;
                } else {
                    errorMessage = Object.entries(errorData)
                        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                        .join('; ');
                }
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


// ============================================================
// TYPES - Backend (ce que FastAPI renvoie)
// ============================================================

type BackendSymptom = {
    nom: string;
    localisation: string | null;
    date_debut: string | null;
    frequence: string | null;
    duree: string | null;
    evolution: string | null;
    activite_declenchante: string | null;
    degre: string | null;
    description_patient: string | null;
};

type BackendDiagnosticPhysique = {
    nom: string;
    resultat: string | null;
    localisation?: string | null;
};

type BackendExamen = {
    nom: string;
    resultat: string | null;
    anatomie: string | null;
    valeur_normale: string | null;
    interpretation: string | null;
};

type BackendTraitement = {
    nom: string;
    mode_administration: string | null;
    date_debut: string | null;
    observation: string | null;
    efficacite: string | null;
    posologie: string | null;
};

type BackendLigneOrdonnance = {
    nom_medicament: string;
    dosage: string;
    forme: string | null;
    frequence: string;
    duree: string;
    voie: string;
    consigne: string | null;
};

type BackendAllergie = {
    nom: string;
    manifestation: string | null;
};

type BackendMaladie = {
    nom: string;
    date_debut_fin: string | null;
    observation: string | null;
};

type BackendAntecedents = {
    antecedents_familiaux: string[];
    allergies: BackendAllergie[];
    maladies: BackendMaladie[];
    chirurgies: { nom: string; date: string | null }[];
    antecedents_obstetricaux: { nombre_grossesse: number | null } | null;
    vaccinations: string[];
};

type BackendModeDeVie = {
    qualite_eau: string | null;
    moustiquaire: boolean | null;
    type_habitat: string | null;
    voyages: { lieu: string | null; duree: string | null }[];
    addictions: { nom: string; quantite: string | null }[];
};

type BackendDonneesPersonnelles = {
    age: number;
    sexe: string;
    etat_civil: string | null;
    profession: string | null;
    nombre_enfant: number | null;
    groupe_sanguin: string | null;
    region_origine: string | null;
    type_habitat?: string | null;
};

type BackendClinicalCase = {
    id_unique: string;
    hash_authentification?: string;
    statut: string; // "en_attente" | "valide" | "rejete" | "PUBLIE" etc.
    // status: "en_attente" | "valide" | "rejete"; // Changed to 'statut' due to backend field name
    date_creation: string | null;
    date_validation: string | null;
    validateur_id: string | null;
    commentaire_validation: string | null;
    niveau_difficulte: string | null;
    pathologie_principale: string | null;
    specialite_medicale: string | null;
    objectifs_pedagogiques: string[];
    motif_consultation: string;
    donnees_patient: BackendDonneesPersonnelles;
    mode_de_vie: BackendModeDeVie;
    antecedents_medicaux: BackendAntecedents;
    symptomes: BackendSymptom[];
    diagnostic_physique: BackendDiagnosticPhysique[];
    examens_complementaires: BackendExamen[];
    traitement_en_cours: BackendTraitement[];
    diagnostic_final: string | null;
    indices_cliniques: string[];
    erreurs_courantes: string[];
    ordonnance_ideale: BackendLigneOrdonnance[];
};

type BackendStats = {
    total_cas: number;
    par_pathologie: Record<string, number>;
    par_niveau: Record<string, number>;
    par_status: Record<string, number>;
    par_sexe: Record<string, number>;
    age_moyen: number;
};

type BackendFilters = {
    genders: string[];
    professions: string[];
    symptoms: string[];
    pathologies: string[];
    niveaux: string[];
    statuses: string[];
};


// ============================================================
// TYPES - Frontend (ce que les composants attendent)
// ============================================================

export type CaseStatus = "attente" | "validé" | "rejeté";

export type ExpertCaseData = {
    id: string;
    patientAge: number;
    gender: "Male" | "Female";
    domain: string;
    extractionDate: string;
    status: CaseStatus;
    difficulty: "Débutant" | "Intermédiaire" | "Avancé" | "Expert" | "Non défini";
};

export type DashboardData = {
    kpis: { 
        totalCases: number; 
        pendingCases: number; 
        validatedCases: number;
        rejectedCases: number;
        trendTotal?: { value: number; period: string; };
        trendPending?: { value: number; period: string; };
        trendValidated?: { value: number; period: string; };
    };
    cases: ExpertCaseData[];
};

export type CaseReviewData = {
    id: string;
    title: string;
    status: CaseStatus;
    createdDate: string;
    patientInfo: {
        gender: "Male" | "Female";
        age: number;
        bmi: number | string;
        patientId: string;
        profession: string | null;
        etatCivil: string | null;
        groupeSanguin: string | null;
        region: string | null;
    };
    patientHistory: string;
    pastMedicalHistory: string[];
    modeDeVie: {
        qualiteEau: string | null;
        moustiquaire: boolean | null;
        habitat: string | null;
        voyages: string[];
        addictions: string[];
    };
    symptomes: {
        nom: string;
        description: string | null;
        degre: string | null;
        duree: string | null;
        localisation: string | null;
    }[];
    diagnosticPhysique: {
        nom: string;
        resultat: string | null;
    }[];
    laboratoryResults: {
        testName: string;
        result: string;
        referenceRange: string;
        status: "High" | "Normal" | "Elevated";
    }[];
    traitementEnCours: {
        nom: string;
        posologie: string | null;
        efficacite: string | null;
    }[];
    // Données pédagogiques (pour l'expert)
    diagnosticFinal: string | null;
    indicesCliniques: string[];
    erreursCourantes: string[];
    niveauDifficulte: string | null;
    specialiteMedicale: string | null;
    objectifsPedagogiques: string[];
    ordonnanceIdeale: {
        nom_medicament: string;
        dosage: string;
        forme: string;
        frequence: string;
        duree: string;
    }[];
};

// Type pour les filtres disponibles
export type AvailableFilters = {
    genders: string[];
    professions: string[];
    symptoms: string[];
    pathologies: string[];
    niveaux: string[];
    statuses: string[];
};


// ============================================================
// FONCTIONS DE MAPPING
// ============================================================

/**
 * Mappe le status backend vers frontend
 */
const mapStatus = (backendStatus: string): CaseStatus => {
    switch (backendStatus) {
        case "en_attente": // Legacy
        case "EN_REVISION": 
        case "BROUILLON_IA": return "attente";
        
        case "valide": // Legacy
        case "PUBLIE": return "validé";
        
        case "rejete": // Legacy
        case "REJETE": return "rejeté";
        
        default: return "attente";
    }
};

/**
 * Mappe le status frontend vers backend
 */
const mapStatusToBackend = (frontendStatus: CaseStatus): string => {
    switch (frontendStatus) {
        case "attente": return "EN_REVISION";
        case "validé": return "PUBLIE";
        case "rejeté": return "REJETE";
        default: return "EN_REVISION";
    }
};

/**
 * Mappe le sexe backend vers frontend
 */
const mapGender = (backendGender: string): "Male" | "Female" => {
    return backendGender === "M" ? "Male" : "Female";
};

/**
 * Mappe un cas backend vers le format tableau dashboard
 */
const mapDifficulty = (level: string | null): "Débutant" | "Intermédiaire" | "Avancé" | "Expert" | "Non défini" => {
    if (!level) return "Non défini";
    switch(level) {
        case "DEBUTANT": return "Débutant";
        case "INTERMEDIAIRE": return "Intermédiaire";
        case "AVANCE": return "Avancé";
        case "EXPERT": return "Expert";
        default: return "Non défini";
    }
}

const mapCaseToExpertData = (backendCase: BackendClinicalCase): ExpertCaseData => {
    return {
        id: backendCase.id_unique,
        patientAge: backendCase.donnees_patient.age,
        gender: mapGender(backendCase.donnees_patient.sexe),
        domain: backendCase.pathologie_principale || "Non défini",
        extractionDate: backendCase.date_creation || new Date().toISOString(),
        status: mapStatus(backendCase.statut),
        difficulty: mapDifficulty(backendCase.niveau_difficulte),
    };
};

/**
 * Détermine le statut d'un résultat de labo
 */
const determineLabStatus = (interpretation: string | null): "High" | "Normal" | "Elevated" => {
    if (!interpretation) return "Normal";
    const lower = interpretation.toLowerCase();
    if (lower.includes("pathologique") || lower.includes("élevé") || lower.includes("anémie")) {
        return "High";
    }
    if (lower.includes("anormal")) {
        return "Elevated";
    }
    return "Normal";
};

/**
 * Mappe un cas backend vers le format détaillé pour review
 */
const mapCaseToReviewData = (backendCase: BackendClinicalCase): CaseReviewData => {
    // Construire l'historique patient à partir du motif et des symptômes
    const symptomesDescription = backendCase.symptomes
        .map(s => {
            let desc = s.description_patient || s.nom;
            if (s.duree) desc += ` depuis ${s.duree}`;
            if (s.degre) desc += ` (${s.degre})`;
            return desc;
        })
        .join(". ");
    
    const patientHistory = `Motif de consultation: ${backendCase.motif_consultation}\n\n${symptomesDescription}`;

    // Construire les antécédents médicaux
    const pastMedicalHistory: string[] = [];
    
    // Antécédents familiaux
    backendCase.antecedents_medicaux.antecedents_familiaux.forEach(a => {
        pastMedicalHistory.push(a);
    });
    
    // Maladies
    backendCase.antecedents_medicaux.maladies.forEach(m => {
        let entry = m.nom;
        if (m.observation) entry += ` (${m.observation})`;
        pastMedicalHistory.push(entry);
    });
    
    // Allergies
    backendCase.antecedents_medicaux.allergies.forEach(a => {
        pastMedicalHistory.push(`Allergie: ${a.nom}${a.manifestation ? ` - ${a.manifestation}` : ''}`);
    });
    
    // Chirurgies
    backendCase.antecedents_medicaux.chirurgies.forEach(c => {
        pastMedicalHistory.push(`Chirurgie: ${c.nom}${c.date ? ` (${c.date})` : ''}`);
    });

    // Vaccinations
    if (backendCase.antecedents_medicaux.vaccinations.length > 0) {
        pastMedicalHistory.push(`Vaccinations: ${backendCase.antecedents_medicaux.vaccinations.join(', ')}`);
    }

    // Si aucun antécédent
    if (pastMedicalHistory.length === 0) {
        pastMedicalHistory.push("Aucun antécédent notable");
    }

    // Mode de vie
    const voyages = backendCase.mode_de_vie.voyages
        .filter(v => v.lieu)
        .map(v => `${v.lieu}${v.duree ? ` (${v.duree})` : ''}`);
    
    const addictions = backendCase.mode_de_vie.addictions
        .filter(a => a.nom)
        .map(a => `${a.nom}${a.quantite ? `: ${a.quantite}` : ''}`);

    // Résultats de laboratoire
    const laboratoryResults = backendCase.examens_complementaires.map(exam => ({
        testName: exam.nom,
        result: exam.resultat || "Non disponible",
        referenceRange: exam.valeur_normale || "N/A",
        status: determineLabStatus(exam.interpretation),
    }));

    return {
        id: backendCase.id_unique,
        title: backendCase.pathologie_principale || backendCase.motif_consultation,
        status: mapStatus(backendCase.statut),
        createdDate: backendCase.date_creation || new Date().toISOString(),
        patientInfo: {
            gender: mapGender(backendCase.donnees_patient.sexe),
            age: backendCase.donnees_patient.age,
            bmi: backendCase.donnees_patient.groupe_sanguin || "N/A",
            patientId: `#${backendCase.id_unique.split('-')[1] || backendCase.id_unique}`,
            profession: backendCase.donnees_patient.profession,
            etatCivil: backendCase.donnees_patient.etat_civil,
            groupeSanguin: backendCase.donnees_patient.groupe_sanguin,
            region: backendCase.donnees_patient.region_origine,
        },
        patientHistory,
        pastMedicalHistory,
        modeDeVie: {
            qualiteEau: backendCase.mode_de_vie.qualite_eau,
            moustiquaire: backendCase.mode_de_vie.moustiquaire,
            habitat: backendCase.mode_de_vie.type_habitat,
            voyages,
            addictions,
        },
        symptomes: backendCase.symptomes.map(s => ({
            nom: s.nom,
            description: s.description_patient,
            degre: s.degre,
            duree: s.duree,
            localisation: s.localisation,
        })),
        diagnosticPhysique: backendCase.diagnostic_physique.map(d => ({
            nom: d.nom,
            resultat: d.resultat,
        })),
        laboratoryResults,
        traitementEnCours: backendCase.traitement_en_cours.map(t => ({
            nom: t.nom,
            posologie: t.posologie,
            efficacite: t.efficacite,
        })),
        diagnosticFinal: backendCase.diagnostic_final,
        indicesCliniques: backendCase.indices_cliniques,
        erreursCourantes: backendCase.erreurs_courantes,
        niveauDifficulte: backendCase.niveau_difficulte,
        specialiteMedicale: backendCase.specialite_medicale,
        objectifsPedagogiques: backendCase.objectifs_pedagogiques,
        ordonnanceIdeale: (backendCase.ordonnance_ideale || []).map(ligne => ({
            nom_medicament: ligne.nom_medicament,
            dosage: ligne.dosage,
            forme: ligne.forme || "",
            frequence: ligne.frequence,
            duree: ligne.duree,
        }))
    };
};


// ============================================================
// FONCTIONS API - CAS CLINIQUES
// ============================================================

/**
 * Récupère tous les cas avec filtres optionnels
 */
export const getCases = async (filters?: {
    keyword?: string;
    min_age?: number;
    max_age?: number;
    gender?: string;
    profession?: string;
    symptom?: string;
    pathologie?: string;
    niveau?: string;
    status?: string;
    limit?: number;
}): Promise<BackendClinicalCase[]> => {
    const params = new URLSearchParams();
    
    if (filters) {
        if (filters.keyword) params.append('keyword', filters.keyword);
        if (filters.min_age) params.append('min_age', filters.min_age.toString());
        if (filters.max_age) params.append('max_age', filters.max_age.toString());
        if (filters.gender) params.append('gender', filters.gender);
        if (filters.profession) params.append('profession', filters.profession);
        if (filters.symptom) params.append('symptom', filters.symptom);
        if (filters.pathologie) params.append('pathologie', filters.pathologie);
        if (filters.niveau) params.append('niveau', filters.niveau);
        if (filters.status) params.append('status', mapStatusToBackend(filters.status as CaseStatus));
        if (filters.limit) params.append('limit', filters.limit.toString());
    }
    
    // CHANGE: Adjusted endpoint to match DRF router path
    const url = `${API_BASE_URL}/api/v1/expert/cas-cliniques/${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, {
        headers: getAuthHeaders()
    });
    const data = await handleApiResponse(response);
    // Handle DRF pagination response structure if present
    return Array.isArray(data) ? data : (data.results || []);
};

/**
 * Récupère un cas par son ID
 */
export const getCaseById = async (id: string): Promise<BackendClinicalCase> => {
    // CHANGE: Adjusted endpoint to match DRF router path
    const response = await fetch(`${API_BASE_URL}/api/v1/expert/cas-cliniques/${id}/`, {
        headers: getAuthHeaders()
    });
    return handleApiResponse(response);
};

/**
 * Récupère les statistiques
 */
export const getStats = async (): Promise<BackendStats> => {
    // CHANGE: Adjusted endpoint to match DRF router path (action)
    const response = await fetch(`${API_BASE_URL}/api/v1/expert/cas-cliniques/stats/`, {
        headers: getAuthHeaders()
    });
    return handleApiResponse(response);
};

/**
 * Récupère les filtres disponibles
 */
export const getFilters = async (): Promise<AvailableFilters> => {
    // CHANGE: Adjusted endpoint to match DRF router path (action)
    const response = await fetch(`${API_BASE_URL}/api/v1/expert/cas-cliniques/filters/`, {
        headers: getAuthHeaders()
    });
    return handleApiResponse(response);
};

/**
 * Met à jour le statut d'un cas
 */
export const updateCaseStatus = async (
    caseId: string, 
    newStatus: CaseStatus,
    commentaire?: string,
    validateurId?: string
): Promise<any> => {
    // CHANGE: Adjusted endpoint to match DRF router path (PATCH on resource)
    const headers = getAuthHeaders() as Record<string, string>;
    const response = await fetch(`${API_BASE_URL}/api/v1/expert/cas-cliniques/${caseId}/`, {
        method: 'PATCH',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            statut: mapStatusToBackend(newStatus), // Field name adjusted to 'statut'
            // Add other fields if supported by serializer
        }),
    });
    return handleApiResponse(response);
};

/**
 * Déclenche la régénération des cas
 */
export const forceExtraction = async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/extract/refresh`, {
        method: 'POST',
    });
    return handleApiResponse(response);
};

/**
 * Exporte les cas filtrés
 */
export const exportCases = async (filters?: {
    pathologie?: string;
    niveau?: string;
    status?: string;
}): Promise<any> => {
    const params = new URLSearchParams();
    if (filters) {
        if (filters.pathologie) params.append('pathologie', filters.pathologie);
        if (filters.niveau) params.append('niveau', filters.niveau);
        if (filters.status) params.append('status', filters.status);
    }
    
    const url = `${API_BASE_URL}/api/export${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    return handleApiResponse(response);
};


// ============================================================
// FONCTIONS API - DASHBOARD EXPERT
// ============================================================

/**
 * Récupère les données du dashboard expert (KPIs + liste des cas)
 */
export const getExpertDashboardData = async (): Promise<DashboardData> => {
    try {
        // Récupérer les stats et les cas en parallèle
        const [stats, cases] = await Promise.all([
            getStats(),
            getCases(),
        ]);

        // Mapper les cas pour le tableau
        const mappedCases = cases.map(mapCaseToExpertData);

        // Extraire les KPIs des stats
        // Note: Backend keys match Django TextChoices (PUBLIE, EN_REVISION, REJETE, BROUILLON_IA)
        const pendingCases = (stats.par_status?.EN_REVISION || 0) + (stats.par_status?.BROUILLON_IA || 0) + (stats.par_status?.en_attente || 0);
        const validatedCases = (stats.par_status?.PUBLIE || 0) + (stats.par_status?.valide || 0); // Include legacy 'valide' just in case
        const rejectedCases = (stats.par_status?.REJETE || 0) + (stats.par_status?.rejete || 0);

        return {
            kpis: {
                totalCases: stats.total_cas,
                pendingCases,
                validatedCases,
                rejectedCases,
                trendTotal: { value: 12, period: "depuis le mois dernier" },
                trendPending: { value: 8, period: "cette semaine" },
                trendValidated: { value: 8, period: "cette semaine" },
            },
            cases: mappedCases,
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des données dashboard:", error);
        throw error;
    }
};

/**
 * Récupère un cas pour la page de review
 */
export const getCaseForReview = async (caseId: string): Promise<CaseReviewData> => {
    try {
        const backendCase = await getCaseById(caseId);
        return mapCaseToReviewData(backendCase);
    } catch (error) {
        console.error(`Erreur lors de la récupération du cas ${caseId}:`, error);
        throw error;
    }
};


// ============================================================
// FONCTIONS API - ACTIONS EXPERT
// ============================================================

/**
 * Valide un cas clinique
 */
export const validateCase = async (caseId: string, commentaire?: string): Promise<any> => {
    return updateCaseStatus(caseId, "validé", commentaire);
};

/**
 * Rejette un cas clinique
 */
export const rejectCase = async (caseId: string, commentaire?: string): Promise<any> => {
    return updateCaseStatus(caseId, "rejeté", commentaire);
};

/**
 * Publie un cas (alias de validateCase pour compatibilité)
 */
export const publishCase = async (caseId: string): Promise<any> => {
    return validateCase(caseId, "Publié par l'expert");
};

/**
 * Met à jour un cas (sauvegarde brouillon)
 */
export const updateCase = async (caseId: string, data: any): Promise<any> => {
    // Pour l'instant, on log les données
    // TODO: Implémenter l'endpoint de mise à jour côté backend si nécessaire
    console.log(`Sauvegarde brouillon pour ${caseId}:`, data);
    return { status: "success", message: "Brouillon sauvegardé" };
};


// ============================================================
// FONCTIONS API - FILTRES POUR LE TABLEAU
// ============================================================

/**
 * Récupère les options de filtres pour le tableau des cas
 */
export const getFilterOptions = async (): Promise<{
    domains: string[];
    statuses: { value: string; label: string }[];
    ageRanges: { value: string; label: string; min: number; max: number }[];
    genders: { value: string; label: string }[];
}> => {
    try {
        const filters = await getFilters();
        
        return {
            domains: filters.pathologies || [],
            statuses: [
                { value: "all", label: "Tous les statuts" },
                { value: "attente", label: "En attente" },
                { value: "validé", label: "Validé" },
                { value: "rejeté", label: "Rejeté" },
            ],
            ageRanges: [
                { value: "all", label: "Tous les âges", min: 0, max: 150 },
                { value: "21-35", label: "21-35 ans", min: 21, max: 35 },
                { value: "36-55", label: "36-55 ans", min: 36, max: 55 },
                { value: "56+", label: "56+ ans", min: 56, max: 150 },
            ],
            genders: [
                { value: "all", label: "Tous" },
                { value: "M", label: "Homme" },
                { value: "F", label: "Femme" },
            ],
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des filtres:", error);
        // Retourner des valeurs par défaut en cas d'erreur
        return {
            domains: [],
            statuses: [
                { value: "all", label: "Tous les statuts" },
                { value: "attente", label: "En attente" },
                { value: "validé", label: "Validé" },
                { value: "rejeté", label: "Rejeté" },
            ],
            ageRanges: [
                { value: "all", label: "Tous les âges", min: 0, max: 150 },
                { value: "21-35", label: "21-35 ans", min: 21, max: 35 },
                { value: "36-55", label: "36-55 ans", min: 36, max: 55 },
                { value: "56+", label: "56+ ans", min: 56, max: 150 },
            ],
            genders: [
                { value: "all", label: "Tous" },
                { value: "M", label: "Homme" },
                { value: "F", label: "Femme" },
            ],
        };
    }
};


// ============================================================
// ANCIENNES FONCTIONS (Compatibilité)
// ============================================================

export const getExpertProfile = async () => {
    console.warn("API non implémentée: getExpertProfile.");
    return { specialty: "Non défini", bio: "" };
};

export const updateExpertProfile = async (data: any) => {
    console.warn("API non implémentée: updateExpertProfile.");
    return { status: "success", message: "Profil mis à jour (simulation)." };
};

export const getDomaines = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/expert/domaines/`, {
            headers: getAuthHeaders()
        });
        const data = await handleApiResponse(response);
        // L'API DRF retourne soit une liste directe, soit un objet paginé { results: [...] }
        // Si c'est paginé, on prend .results, sinon on prend la réponse telle quelle.
        const results = Array.isArray(data) ? data : (data.results || []);
        
        return results.map((d: any) => ({
            id: d.id,
            nom: d.nom
        }));
    } catch (error) {
        console.error("Erreur getDomaines:", error);
        return [];
    }
};

// Auth functions - Mode Mock pour le développement
// TODO: Remplacer par de vrais appels API quand le backend auth sera prêt

export const apprenantRegister = async (data: { nom: string; email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
};

export const apprenantLogin = async (data: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
};

export const expertRegister = async (data: {
    nom: string;
    email: string;
    password: string;
    matricule: string;
    domaine_expertise_id: string;
}) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/expert/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
};

export const expertLogin = async (data: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/expert/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
};

export const logout = async (token: string) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 200));
    return { status: "success" };
};

// Session functions (à implémenter)
export const startSession = (email_apprenant: string, domaine_nom: string, token: string) => {
    console.warn("Session non implémentée");
    return Promise.resolve({ status: "success" });
};

export const analyseResponse = (session_id: string, reponse_etudiant: string, token: string) => {
    console.warn("Session non implémentée");
    return Promise.resolve({ status: "success" });
};

export const getSessionState = (session_id: string, token: string) => {
    console.warn("Session non implémentée");
    return Promise.resolve({ status: "success" });
};

export const getSessionsByDomain = async (apprenantId: string, domaineNom: string, token: string) => {
    console.warn("Session non implémentée");
    return [];
};

export const deleteSession = async (sessionId: string, token: string) => {
    console.warn("Session non implémentée");
    return { status: "success" };
};

// ============================================================
// API PROFILING (Module Apprenant)
// ============================================================

export type ProfilingQuestion = {
    id: number;
    competence: string;
    situation: string;
    question_text: string;
    options: { texte: string; score: number; feedback: string }[];
};

export const getProfilingQuestions = async (token: string): Promise<ProfilingQuestion[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/apprenant/questions-profiling/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
        },
    });
    return await handleApiResponse(response);
};

export const submitProfiling = async (reponses: { [questionId: number]: number }, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/apprenant/questions-profiling/submit/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
        },
        body: JSON.stringify({ reponses }),
    });
    return await handleApiResponse(response);
};

// --- Tutor / Chat API ---

export interface TutorSessionStartResponse {
    session_id: string;
    message: string;
}

export interface EvaluationData {
  competence: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface TutorInteractionResponse {
    status: string;
    latest_exchange: {
        patient: string;
        tutor: string;
    };
    chat_history: {
        person: "doctor" | "patient";
        message: string;
    }[];
     student_profile: any;
     formative_evaluation?: EvaluationData;
}

export const startTutorSession = async (emailApprenant: string, domaineNom: string): Promise<TutorSessionStartResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/tuteur/session/start/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            email_apprenant: emailApprenant,
            domaine_nom: domaineNom
        }),
    });
    return handleApiResponse(response);
}

export const sendTutorMessage = async (sessionId: string, messageEtudiant: string): Promise<TutorInteractionResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/tuteur/session/analyser/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            session_id: sessionId,
            reponse_etudiant: messageEtudiant
        }),
    });
    return handleApiResponse(response);
}

export const getTutorSessionState = async (sessionId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/tuteur/session/${sessionId}/state/`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
}

export interface SummativeData {
  score_global: number;
  score_communication: number;
  score_anamnese: number;
  score_diagnostic: number;
  score_prise_en_charge: number;
  difficultes_identifiees: string[];
  points_forts: string[];
  feedback_global: string;
}

export const endTutorSession = async (sessionId: string): Promise<SummativeData> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/tuteur/session/end/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            session_id: sessionId
        }),
    });
    return handleApiResponse(response);
}



