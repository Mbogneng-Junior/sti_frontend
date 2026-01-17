"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDomaines } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Stethoscope, Brain, BookOpen, Award, Shield, Users } from "lucide-react";
import { toast } from "sonner";

export default function MarketingPage() {
    const { login, register, user, role } = useAuth();
    const router = useRouter();

    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [userRole, setUserRole] = useState<'apprenant' | 'expert'>('apprenant');

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nom, setNom] = useState("");
    const [matricule, setMatricule] = useState("");
    const [domaineId, setDomaineId] = useState("");

    const [domaines, setDomaines] = useState<{ id: string, nom: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            const destination = role === 'expert' ? '/expert/dashboard' : '/learn';
            router.push(destination);
        }
    }, [user, role, router]);

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
                toast.success("Connexion réussie !");
            } else {
                if (userRole === 'apprenant') {
                    await register({ nom, email, password }, 'apprenant');
                } else {
                    if (!domaineId) throw new Error("Veuillez sélectionner un domaine d'expertise.");
                    await register({ nom, email, password, matricule, domaine_expertise_id: domaineId }, 'expert');
                }
                toast.success("Inscription réussie !", { description: "Vous pouvez maintenant vous connecter." });
                setAuthMode('login');
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

    if (user) return null;

    const features = [
        { icon: Brain, title: "IA Avancée", description: "Apprentissage personnalisé par intelligence artificielle" },
        { icon: BookOpen, title: "Cas Cliniques", description: "Bibliothèque riche en études de cas réels" },
        { icon: Award, title: "Certifications", description: "Validez vos compétences avec des certificats reconnus" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
                <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-16">

                    {/* Left Side - Hero Section */}
                    <div className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left space-y-8">
                        {/* Logo and Brand */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/40">
                                <Stethoscope className="w-8 h-8 text-white" />
                            </div>
                            <span className="text-3xl font-bold text-white">FultangMed</span>
                        </div>

                        {/* Main Headline */}
                        <div className="space-y-6">
                            <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight">
                                Maîtrisez les
                                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent"> Sciences Médicales</span>
                            </h1>
                            <p className="text-xl text-blue-100/80 max-w-xl leading-relaxed">
                                Plateforme d&apos;apprentissage médical propulsée par l&apos;intelligence artificielle.
                                Développez vos compétences cliniques avec des cas pratiques validés par des experts.
                            </p>
                        </div>

                        {/* Feature Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl mt-4">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 group"
                                >
                                    <feature.icon className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                                    <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
                                    <p className="text-blue-200/60 text-xs leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-8 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">500+</div>
                                    <div className="text-sm text-blue-200/60">Apprenants</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">50+</div>
                                    <div className="text-sm text-blue-200/60">Experts</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Auth Form */}
                    <div className="w-full max-w-md">
                        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 p-8 border border-white/20">
                            {/* Role Selector */}
                            <div className="flex gap-2 mb-8 p-1.5 bg-slate-100 rounded-2xl">
                                <button
                                    onClick={() => toggleRole('apprenant')}
                                    className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                        userRole === 'apprenant'
                                            ? 'bg-white text-slate-900 shadow-lg'
                                            : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    Apprenant
                                </button>
                                <button
                                    onClick={() => toggleRole('expert')}
                                    className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                        userRole === 'expert'
                                            ? 'bg-white text-slate-900 shadow-lg'
                                            : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    Expert Médical
                                </button>
                            </div>

                            {/* Title */}
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                    {authMode === 'login' ? 'Bienvenue' : 'Créer un compte'}
                                </h2>
                                <p className="text-slate-500 text-sm">
                                    {authMode === 'login'
                                        ? 'Connectez-vous pour continuer votre apprentissage'
                                        : 'Rejoignez notre communauté médicale'}
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm mb-6 flex items-center gap-3">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    {error}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {authMode === 'register' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="nom" className="text-sm font-medium text-slate-700">Nom Complet</Label>
                                        <Input
                                            id="nom"
                                            value={nom}
                                            onChange={e => setNom(e.target.value)}
                                            required
                                            disabled={isLoading}
                                            placeholder="Dr. Jean Dupont"
                                            className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">Adresse Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        placeholder="votre@email.com"
                                        className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">Mot de passe</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        placeholder="••••••••"
                                        className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    />
                                </div>
                                {userRole === 'expert' && authMode === 'register' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="matricule" className="text-sm font-medium text-slate-700">Matricule Professionnel</Label>
                                            <Input
                                                id="matricule"
                                                value={matricule}
                                                onChange={e => setMatricule(e.target.value)}
                                                required
                                                disabled={isLoading}
                                                placeholder="MED-XXXX-XXXX"
                                                className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="domaine" className="text-sm font-medium text-slate-700">Domaine d&apos;Expertise</Label>
                                            <Select onValueChange={setDomaineId} required disabled={isLoading}>
                                                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50">
                                                    <SelectValue placeholder="Sélectionnez votre spécialité" />
                                                </SelectTrigger>
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
                                    className="w-full h-12 rounded-xl font-semibold text-white transition-all mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin mx-auto" size={20} />
                                    ) : (
                                        authMode === 'login' ? 'Se Connecter' : 'Créer mon compte'
                                    )}
                                </button>
                            </form>

                            {/* Toggle Auth Mode */}
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <p className="text-center text-sm text-slate-500">
                                    {authMode === 'login' ? "Nouveau sur FultangMed ?" : "Déjà un compte ?"}
                                    <button
                                        onClick={() => toggleMode(authMode === 'login' ? 'register' : 'login')}
                                        className="font-semibold text-blue-600 hover:text-blue-700 ml-1.5 transition-colors"
                                    >
                                        {authMode === 'login' ? 'Créer un compte' : 'Se connecter'}
                                    </button>
                                </p>
                            </div>
                        </div>

                        {/* Trust Badge */}
                        <div className="mt-6 text-center">
                            <p className="text-blue-200/50 text-xs flex items-center justify-center gap-2">
                                <Shield className="w-4 h-4" />
                                Données sécurisées et confidentielles
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
