"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
                .catch(err => setError("Impossible de charger les domaines."))
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
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue.");
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
        <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-12">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="relative w-60 h-60 lg:w-[424px] lg:h-[424px] mb-8 lg:mb-0">
                    <Image src="/Mobile_Game_Character_Spritesheet.png" fill alt="Hero" className="object-contain" />
                </div>
                <h1 className="text-xl lg:text-3xl font-bold text-neutral-600 max-w-[480px]">
                    Apprenez, pratiquez et maîtrisez les sciences médicales avec Tuteur5GI
                </h1>
            </div>

            <div className="w-full max-w-md p-6 border rounded-2xl shadow-lg bg-white">
                <div className="grid grid-cols-2 gap-2 mb-6">
                    <Button onClick={() => toggleRole('apprenant')} variant={userRole === 'apprenant' ? 'secondary' : 'outline'}>Je suis Apprenant</Button>
                    <Button onClick={() => toggleRole('expert')} variant={userRole === 'expert' ? 'primary' : 'outline'}>Je suis Expert</Button>
                </div>
                <h2 className="text-2xl font-bold text-center mb-4">{authMode === 'login' ? 'Connexion' : 'Inscription'}</h2>
                {error && <p className="bg-red-100 text-red-700 p-2 rounded-md text-sm text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {authMode === 'register' && (
                        <div>
                            <Label htmlFor="nom">Nom Complet</Label>
                            <Input id="nom" value={nom} onChange={e => setNom(e.target.value)} required disabled={isLoading} />
                        </div>
                    )}
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={isLoading} />
                    </div>
                    <div>
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required disabled={isLoading} />
                    </div>
                    {userRole === 'expert' && authMode === 'register' && (
                        <>
                            <div>
                                <Label htmlFor="matricule">Matricule Professionnel</Label>
                                <Input id="matricule" value={matricule} onChange={e => setMatricule(e.target.value)} required disabled={isLoading} />
                            </div>
                            <div>
                                <Label htmlFor="domaine">Domaine d'Expertise</Label>
                                <Select onValueChange={setDomaineId} required disabled={isLoading}>
                                    <SelectTrigger><SelectValue placeholder="Sélectionnez votre domaine" /></SelectTrigger>
                                    <SelectContent>
                                        {domaines.map(d => <SelectItem key={d.id} value={d.id}>{d.nom}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : (authMode === 'login' ? 'Se Connecter' : 'S\'inscrire')}
                    </Button>
                </form>
                <p className="text-center text-sm mt-4">
                    {authMode === 'login' ? "Pas encore de compte ?" : "Déjà un compte ?"}
                    <button onClick={() => toggleMode(authMode === 'login' ? 'register' : 'login')} className="font-semibold text-primary hover:underline ml-1">
                        {authMode === 'login' ? 'Inscrivez-vous' : 'Connectez-vous'}
                    </button>
                </p>
            </div>
        </div>
    );
}