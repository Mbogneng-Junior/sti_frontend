"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Stethoscope,
  Eye,
  EyeOff,
  Check,
  Loader2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Liste des specialites medicales (basee sur pathologies_knowledge.json)
const specialites = [
  { value: "medecine-generale", label: "Medecine Generale" },
  { value: "urgences", label: "Urgences" },
  { value: "medecine-interne", label: "Medecine Interne" },
  { value: "pneumologie", label: "Pneumologie" },
  { value: "cardiologie", label: "Cardiologie" },
  { value: "endocrinologie", label: "Endocrinologie" },
  { value: "urologie", label: "Urologie" },
];

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  confirmPassword: string;
  specialite: string;
  telephone: string;
}

interface FormErrors {
  nom?: string;
  prenom?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  specialite?: string;
}

export default function AddExpertPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialite: "",
    telephone: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prenom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    if (!formData.specialite) {
      newErrors.specialite = "La specialite est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Remplacer par l'appel API reel
      // await api.createExpert({
      //   nom: formData.nom,
      //   prenom: formData.prenom,
      //   email: formData.email,
      //   password: formData.password,
      //   specialite: formData.specialite,
      //   telephone: formData.telephone,
      // });

      // Simulation d'un delai d'API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Expert ajoute avec succes!", {
        description: `${formData.prenom} ${formData.nom} a ete ajoute en tant qu'expert en ${
          specialites.find((s) => s.value === formData.specialite)?.label
        }`,
      });

      // Redirection vers la liste des experts
      router.push("/admin/experts");
    } catch (error) {
      toast.error("Erreur lors de la creation de l'expert", {
        description: "Veuillez reessayer plus tard",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion des changements dans les inputs
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Efface l'erreur du champ modifie
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Generation d'un mot de passe par defaut
  const generateDefaultPassword = () => {
    const password = `Expert@${Math.random().toString(36).slice(-8)}`;
    setFormData((prev) => ({
      ...prev,
      password: password,
      confirmPassword: password,
    }));
    setErrors((prev) => ({ ...prev, password: undefined, confirmPassword: undefined }));
    toast.info("Mot de passe genere", {
      description: "N'oubliez pas de communiquer ce mot de passe a l'expert",
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/experts">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ajouter un Expert</h1>
          <p className="text-gray-500 mt-1">
            Creez un nouveau compte expert pour la validation des cas cliniques
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Informations de l&apos;Expert</CardTitle>
          <CardDescription>
            Remplissez les informations ci-dessous pour creer le compte expert.
            L&apos;expert recevra un email avec ses identifiants de connexion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom et Prenom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  Nom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nom"
                  placeholder="Ex: Kamga"
                  value={formData.nom}
                  onChange={(e) => handleChange("nom", e.target.value)}
                  className={errors.nom ? "border-red-300 focus:ring-red-500/20" : ""}
                />
                {errors.nom && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.nom}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="prenom" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  Prenom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="prenom"
                  placeholder="Ex: Jean-Pierre"
                  value={formData.prenom}
                  onChange={(e) => handleChange("prenom", e.target.value)}
                  className={errors.prenom ? "border-red-300 focus:ring-red-500/20" : ""}
                />
                {errors.prenom && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.prenom}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                Adresse Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Ex: jean.kamga@hospital.cm"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "border-red-300 focus:ring-red-500/20" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Telephone (optionnel) */}
            <div className="space-y-2">
              <Label htmlFor="telephone" className="flex items-center gap-2">
                Telephone (optionnel)
              </Label>
              <Input
                id="telephone"
                type="tel"
                placeholder="Ex: +237 6XX XXX XXX"
                value={formData.telephone}
                onChange={(e) => handleChange("telephone", e.target.value)}
              />
            </div>

            {/* Specialite */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-gray-400" />
                Specialite Medicale <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.specialite}
                onValueChange={(value) => handleChange("specialite", value)}
              >
                <SelectTrigger className={errors.specialite ? "border-red-300" : ""}>
                  <SelectValue placeholder="Selectionnez une specialite" />
                </SelectTrigger>
                <SelectContent>
                  {specialites.map((spec) => (
                    <SelectItem key={spec.value} value={spec.value}>
                      {spec.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.specialite && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.specialite}
                </p>
              )}
              <p className="text-xs text-gray-500">
                L&apos;expert ne pourra valider que les cas cliniques lies a sa specialite
              </p>
            </div>

            {/* Mot de passe */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gray-400" />
                  Mot de passe par defaut <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={generateDefaultPassword}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Generer automatiquement
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm text-gray-600">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 caracteres"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className={`pr-10 ${errors.password ? "border-red-300 focus:ring-red-500/20" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm text-gray-600">
                    Confirmer le mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirmez le mot de passe"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      className={`pr-10 ${errors.confirmPassword ? "border-red-300 focus:ring-red-500/20" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-blue-900">Email de bienvenue</p>
                <p className="text-blue-700 mt-1">
                  Un email sera automatiquement envoye a l&apos;expert avec ses identifiants
                  de connexion et les instructions pour acceder a la plateforme.
                </p>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Link href="/admin/experts">
                <Button type="button" variant="outline">
                  Annuler
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading} className="min-w-[140px]">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creation...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Creer l&apos;Expert
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
