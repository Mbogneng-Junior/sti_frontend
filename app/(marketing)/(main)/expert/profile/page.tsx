"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getExpertProfile, updateExpertProfile } from "@/lib/api";
import {
  Save,
  User,
  Stethoscope,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";

type ExpertProfileData = {
  specialty: string;
  bio: string;
};

const ExpertProfilePage = () => {
  const [profile, setProfile] = useState<ExpertProfileData>({ specialty: "", bio: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const data = await getExpertProfile();
        setProfile(data);
      } catch (error) {
        console.error("Erreur lors du chargement du profil", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setSaveStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus("idle");
    try {
      await updateExpertProfile(profile);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du profil", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-72 mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            Mon Profil Expert
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerez vos informations professionnelles
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {profile.specialty ? profile.specialty.charAt(0).toUpperCase() : "E"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">Expert Medical</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Stethoscope className="h-3 w-3" />
                    {profile.specialty || "Specialite non definie"}
                  </Badge>
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="specialty" className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  Specialite medicale
                </Label>
                <Input
                  id="specialty"
                  name="specialty"
                  value={profile.specialty}
                  onChange={handleChange}
                  placeholder="Ex: Cardiologie, Pediatrie, Medecine Generale..."
                  disabled={isSaving}
                  className="text-base"
                />
                <p className="text-xs text-muted-foreground">
                  Votre domaine d'expertise principal
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Biographie professionnelle
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Decrivez votre parcours, votre expertise et votre experience professionnelle..."
                  rows={6}
                  disabled={isSaving}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Cette description sera visible par les autres membres de la plateforme
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {saveStatus === "success" && (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      Profil sauvegarde avec succes
                    </div>
                  )}
                  {saveStatus === "error" && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="h-4 w-4" />
                      Erreur lors de la sauvegarde
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={isSaving} className="gap-2">
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isSaving ? "Sauvegarde en cours..." : "Sauvegarder"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpertProfilePage;
