"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDomaines } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth"; // On importe notre hook !
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // Pour de jolies notifications

export default function MarketingPage() {
    const { login, register, user, role } = useAuth(); // On récupère les fonctions et l'état du contexte
    const router = useRouter();

    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [userRole, setUserRole] = useState<'apprenant' | 'expert'>('apprenant');
    
    // États pour les champs de formulaire
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nom, setNom] = useState("");
    const [matricule, setMatricule] = useState("");
    const [domaineId, setDomaineId] = useState("");
    
    const [domaines, setDomaines] = useState<{ id: string, nom: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Si l'utilisateur est déjà connecté, on le redirige immédiatement.
    useEffect(() => {
        if (user) {
            const destination = role === 'expert' ? '/expert/dashboard' : '/learn';
            router.push(destination);
        }
    }, [user, role, router]);

    // Charge les domaines pour le formulaire d'inscription expert
    useEffect(() => {
        if (userRole === 'expert' && authMode === 'register' && domaines.length === 0) {
            setIsLoading(true);
            getDomaines()
                .then(setDomaines)
                .catch(() => setError("Impossible de charger les domaines."))
                .finally(() => setIsLoading(false));
        }
    }, [userRole, authMode, domaines.length]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (authMode === 'login') {
                await login(email, password, userRole);
                // La redirection est gérée dans le hook useAuth
                toast.success("Connexion réussie !");
            } else { // register
                if (userRole === 'apprenant') {
                    await register({ nom, email, password }, 'apprenant');
                } else {
                    if (!domaineId) throw new Error("Veuillez sélectionner un domaine d'expertise.");
                    await register({ nom, email, password, matricule, domaine_expertise_id: domaineId }, 'expert');
                }
                toast.success("Inscription réussie !", { description: "Vous pouvez maintenant vous connecter." });
                setAuthMode('login'); // Basculer vers le formulaire de connexion
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = (mode: 'login' | 'register') => {
        setAuthMode(mode);
        setError(null);
    };

    const toggleRole = (role: 'apprenant' | 'expert') => {
        setUserRole(role);
        setError(null);
    }
    
    // On ne rend rien si l'utilisateur est déjà connecté pour éviter un flash de contenu
    if (user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
            <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between gap-16">
                {/* Left Side - Hero Section */}
                <div className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left space-y-6">
                    <div className="relative w-72 h-72 lg:w-96 lg:h-96">
                        <Image src="/Mobile_Game_Character_Spritesheet.png" fill alt="Hero" className="object-contain drop-shadow-2xl" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                            Apprenez, pratiquez et maîtrisez les sciences médicales
                        </h1>
                        <p className="text-lg text-gray-600 max-w-xl">
                            Avec <span className="font-bold text-blue-600">FultangMed</span>, développez vos compétences médicales grâce à l&apos;intelligence artificielle
                        </p>
                    </div>
                </div>

                {/* Right Side - Auth Form */}
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.12)] p-8">
                        {/* Role Selector */}
                        <div className="flex gap-3 mb-8">
                            <button
                                onClick={() => toggleRole('apprenant')}
                                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                                    userRole === 'apprenant'
                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Je suis Apprenant
                            </button>
                            <button
                                onClick={() => toggleRole('expert')}
                                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                                    userRole === 'expert'
                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Je suis Expert
                            </button>
                        </div>
                        {/* Title */}
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
                            {authMode === 'login' ? 'Connexion' : 'Inscription'}
                        </h2>
                        
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-sm mb-6">
                                {error}
                            </div>
                        )}
                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {authMode === 'register' && (
                                <div>
                                    <Label htmlFor="nom" className="text-sm font-semibold text-gray-700 mb-2 block">Nom Complet</Label>
                                    <Input 
                                        id="nom" 
                                        value={nom} 
                                        onChange={e => setNom(e.target.value)} 
                                        required 
                                        disabled={isLoading}
                                        className="h-12 rounded-xl border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    />
                                </div>
                            )}
                            <div>
                                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">Email</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)} 
                                    required 
                                    disabled={isLoading}
                                    className="h-12 rounded-xl border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                />
                            </div>
                            <div>
                                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-2 block">Mot de passe</Label>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)} 
                                    required 
                                    disabled={isLoading}
                                    className="h-12 rounded-xl border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                />
                            </div>
                            {userRole === 'expert' && authMode === 'register' && (
                                <>
                                    <div>
                                        <Label htmlFor="matricule" className="text-sm font-semibold text-gray-700 mb-2 block">Matricule Professionnel</Label>
                                        <Input 
                                            id="matricule" 
                                            value={matricule} 
                                            onChange={e => setMatricule(e.target.value)} 
                                            required 
                                            disabled={isLoading}
                                            className="h-12 rounded-xl border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="domaine" className="text-sm font-semibold text-gray-700 mb-2 block">Domaine d&apos;Expertise</Label>
                                        <Select onValueChange={setDomaineId} required disabled={isLoading}>
                                            <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Sélectionnez votre domaine" /></SelectTrigger>
                                            <SelectContent>
                                                {domaines.map(d => <SelectItem key={d.id} value={d.id}>{d.nom}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 rounded-xl font-semibold text-white transition-all mt-6 bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin mx-auto" size={20} />
                                ) : (
                                    authMode === 'login' ? 'Se Connecter' : 'S\'inscrire'
                                )}
                            </button>
                        </form>
                        
                        {/* Toggle Auth Mode */}
                        <p className="text-center text-sm text-gray-600 mt-6">
                            {authMode === 'login' ? "Pas encore de compte ?" : "Déjà un compte ?"}
                            <button 
                                onClick={() => toggleMode(authMode === 'login' ? 'register' : 'login')} 
                                className="font-semibold text-blue-600 hover:text-blue-700 ml-1 transition-colors"
                            >
                                {authMode === 'login' ? 'Inscrivez-vous' : 'Connectez-vous'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}