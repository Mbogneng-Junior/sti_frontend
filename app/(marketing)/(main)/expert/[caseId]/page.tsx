"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2, User, Stethoscope, FlaskConical, Pill, Sparkles, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getCaseById } from '@/lib/api'; // Importer la fonction centralisée

// Le type est maintenant inféré depuis la fonction getCaseById.
type CasClinique = Awaited<ReturnType<typeof getCaseById>>;

// --- Composants d'aide ---
const DetailSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className }) => (
    <div className={`mb-8 ${className}`}>
        <div className="flex items-center gap-x-3 mb-4">
            {icon}
            <h2 className="text-xl font-bold text-neutral-800">{title}</h2>
        </div>
        <div className="pl-8 grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
);

const DetailItem: React.FC<{ label: string; value: string | number | boolean | undefined | null}> = ({ label, value }) => {
    if (value === undefined || value === null || value === "") return null;
    return <div className="bg-slate-50 p-3 rounded-lg"><p className="text-sm font-semibold text-slate-500">{label}</p><p className="text-md text-slate-800">{String(value)}</p></div>;
};

// --- Page Principale ---
const CaseDetailPage = () => {
    const params = useParams();
    const caseId = params.caseId as string;

    const [cas, setCas] = useState<CasClinique | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // États pour le mode Défi
    const [isChallengeMode, setIsChallengeMode] = useState(false);
    const [userHypothesis, setUserHypothesis] = useState("");
    const [userExams, setUserExams] = useState("");
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (!caseId) return;
        const fetchCaseDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getCaseById(caseId);
                setCas(data);
            } catch (e: any) {
                setError(e.message || "Impossible de charger les détails du cas.");
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCaseDetails();
    }, [caseId]);
    
    const startChallenge = () => {
        setIsChallengeMode(true);
    };

    if (isLoading) return <div className="p-6 flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-slate-500" /></div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
    if (!cas) return <div className="p-6 text-center">Aucun cas à afficher.</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <Link href="/expert" className="inline-flex items-center gap-x-2 text-sm text-slate-600 hover:text-slate-900 mb-6"><ArrowLeft className="h-4 w-4" />Retour à l'explorateur</Link>
            <div className='mb-6 pb-4 border-b'>
                <h1 className="text-3xl font-extrabold text-green-600">{cas.motif_consultation}</h1>
                <p className="text-xs text-gray-400 mt-1">ID: {cas.id_unique} | Hash: {cas.hash_authentification.substring(0, 16)}...</p>
            </div>

            {/* Sections toujours visibles */}
            <DetailSection title="Patient" icon={<User className="h-6 w-6 text-green-600" />}><DetailItem label="Âge" value={cas.donnees_personnelles.age} /><DetailItem label="Sexe" value={cas.donnees_personnelles.sexe} /></DetailSection>
            <DetailSection title="Symptômes déclarés" icon={<Stethoscope className="h-6 w-6 text-green-600" />}>{cas.symptomes.map((s, i) => <DetailItem key={i} label={s.nom} value={`${s.degre || ''} (${s.duree || 'N/A'})`} />)}</DetailSection>

            {!isChallengeMode ? (
                <>
                    <DetailSection title="Diagnostic Physique" icon={<Stethoscope className="h-6 w-6 text-green-600" />}>{cas.diagnostic_physique.map((d, i) => <DetailItem key={i} label={d.nom} value={d.resultat} />)}</DetailSection>
                    <DetailSection title="Examens & Analyses" icon={<FlaskConical className="h-6 w-6 text-green-600" />}>{cas.examens_complementaires.map((e, i) => <DetailItem key={i} label={e.nom} value={e.resultat} />)}</DetailSection>
                    <div className="mt-12 text-center"><Button onClick={startChallenge}><Sparkles className="mr-2 h-4 w-4" />Lancer le Défi Expert</Button></div>
                </>
            ) : (
                <div className='mt-10 p-6 border-2 border-dashed border-green-500 rounded-xl bg-green-50'>
                    <div className="flex items-center gap-x-3 mb-4">
                        <BrainCircuit className="h-8 w-8 text-green-600"/>
                        <h2 className="text-2xl font-bold text-green-800">Mode Défi Expert</h2>
                    </div>
                    <p className='text-sm text-green-700 mb-6 ml-11'>Les sections "Diagnostic" et "Examens" sont masquées. À vous de jouer.</p>
                    
                    <div className="mb-6">
                        <label className="font-semibold text-neutral-700">1. Quelles sont vos hypothèses de diagnostic ?</label>
                        <Textarea value={userHypothesis} onChange={(e) => setUserHypothesis(e.target.value)} placeholder="Ex: Paludisme simple, crise de tétanie..." className="mt-2 bg-white"/>
                    </div>
                    <div className="mb-8">
                        <label className="font-semibold text-neutral-700">2. Quels examens complémentaires prescrivez-vous ?</label>
                        <Textarea value={userExams} onChange={(e) => setUserExams(e.target.value)} placeholder="Ex: Goutte épaisse, NFS, ionogramme..." className="mt-2 bg-white"/>
                    </div>
                    <div className='text-center'>
                         <Button onClick={() => setShowResults(true)} disabled={showResults} size="lg">Comparer avec le cas réel</Button>
                    </div>

                    {showResults && (
                         <div className="mt-8 animate-in fade-in-50">
                            <h3 className='text-xl font-bold text-center mb-4 text-green-800'>--- Résultats du Cas Réel ---</h3>
                            <DetailSection title="Diagnostic Physique" icon={<Stethoscope className="h-6 w-6 text-green-600" />}>{cas.diagnostic_physique.map((d, i) => <DetailItem key={i} label={d.nom} value={d.resultat} />)}</DetailSection>
                            <DetailSection title="Examens & Analyses" icon={<FlaskConical className="h-6 w-6 text-green-600" />}>{cas.examens_complementaires.map((e, i) => <DetailItem key={i} label={e.nom} value={e.resultat} />)}</DetailSection>
                         </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CaseDetailPage;