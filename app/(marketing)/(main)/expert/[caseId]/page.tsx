"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Loader2,
  User,
  Stethoscope,
  FlaskConical,
  Pill,
  Sparkles,
  BrainCircuit,
  Hash,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff
} from "lucide-react";
import { getCaseById } from "@/lib/api";

type CasClinique = Awaited<ReturnType<typeof getCaseById>>;

const DetailSection = ({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => (
  <Card className={className}>
    <CardHeader className="pb-3">
      <CardTitle className="text-lg flex items-center gap-2">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
    </CardContent>
  </Card>
);

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | undefined | null;
}) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="bg-muted/50 p-3 rounded-lg border">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-medium mt-1">{String(value)}</p>
    </div>
  );
};

const CaseDetailPage = () => {
  const params = useParams();
  const caseId = params.caseId as string;

  const [cas, setCas] = useState<CasClinique | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError(e.message || "Impossible de charger les details du cas.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCaseDetails();
  }, [caseId]);

  const startChallenge = () => {
    setIsChallengeMode(true);
    setShowResults(false);
    setUserHypothesis("");
    setUserExams("");
  };

  const exitChallenge = () => {
    setIsChallengeMode(false);
    setShowResults(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-12 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
          <Card className="border-destructive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 justify-center text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!cas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Aucun cas a afficher.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Back Link */}
        <Link
          href="/expert"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour a l'explorateur
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">
                {cas.motif_consultation}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <Badge variant="outline" className="font-mono text-xs flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {cas.id_unique}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Hash: {cas.hash_authentification.substring(0, 12)}...
                </Badge>
              </div>
            </div>
            {!isChallengeMode && (
              <Button onClick={startChallenge} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Lancer le Defi Expert
              </Button>
            )}
          </div>
        </div>

        {/* Patient Info - Always visible */}
        <DetailSection
          title="Informations Patient"
          icon={<User className="h-5 w-5 text-primary" />}
          className="mb-4"
        >
          <DetailItem label="Age" value={`${cas.donnees_personnelles.age} ans`} />
          <DetailItem label="Sexe" value={cas.donnees_personnelles.sexe} />
        </DetailSection>

        {/* Symptoms - Always visible */}
        <DetailSection
          title="Symptomes declares"
          icon={<Stethoscope className="h-5 w-5 text-primary" />}
          className="mb-4"
        >
          {cas.symptomes.map((s, i) => (
            <DetailItem
              key={i}
              label={s.nom}
              value={`${s.degre || "Non precise"} - Duree: ${s.duree || "N/A"}`}
            />
          ))}
        </DetailSection>

        {/* Normal Mode: Show all info */}
        {!isChallengeMode && (
          <>
            <DetailSection
              title="Diagnostic Physique"
              icon={<Stethoscope className="h-5 w-5 text-primary" />}
              className="mb-4"
            >
              {cas.diagnostic_physique.map((d, i) => (
                <DetailItem key={i} label={d.nom} value={d.resultat} />
              ))}
            </DetailSection>

            <DetailSection
              title="Examens Complementaires"
              icon={<FlaskConical className="h-5 w-5 text-primary" />}
              className="mb-4"
            >
              {cas.examens_complementaires.map((e, i) => (
                <DetailItem key={i} label={e.nom} value={e.resultat} />
              ))}
            </DetailSection>
          </>
        )}

        {/* Challenge Mode */}
        {isChallengeMode && (
          <Card className="border-2 border-primary/50 bg-primary/5 mb-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-primary">Mode Defi Expert</CardTitle>
                    <CardDescription>
                      Les sections "Diagnostic" et "Examens" sont masquees
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={exitChallenge}>
                  Quitter le defi
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    1
                  </span>
                  Quelles sont vos hypotheses de diagnostic ?
                </label>
                <Textarea
                  value={userHypothesis}
                  onChange={(e) => setUserHypothesis(e.target.value)}
                  placeholder="Ex: Paludisme simple, crise de tetanie, infection urinaire..."
                  className="bg-background"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    2
                  </span>
                  Quels examens complementaires prescrivez-vous ?
                </label>
                <Textarea
                  value={userExams}
                  onChange={(e) => setUserExams(e.target.value)}
                  placeholder="Ex: Goutte epaisse, NFS, ionogramme sanguin..."
                  className="bg-background"
                  rows={3}
                />
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => setShowResults(true)}
                  disabled={showResults || (!userHypothesis && !userExams)}
                  size="lg"
                  className="gap-2"
                >
                  {showResults ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                  {showResults ? "Resultats affiches" : "Comparer avec le cas reel"}
                </Button>
              </div>

              {showResults && (
                <div className="mt-8 pt-6 border-t-2 border-primary/30 space-y-4 animate-in fade-in-50 slide-in-from-bottom-4">
                  <div className="text-center mb-6">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Resultats du Cas Reel
                    </Badge>
                  </div>

                  <DetailSection
                    title="Diagnostic Physique"
                    icon={<Stethoscope className="h-5 w-5 text-primary" />}
                  >
                    {cas.diagnostic_physique.map((d, i) => (
                      <DetailItem key={i} label={d.nom} value={d.resultat} />
                    ))}
                  </DetailSection>

                  <DetailSection
                    title="Examens Complementaires"
                    icon={<FlaskConical className="h-5 w-5 text-primary" />}
                  >
                    {cas.examens_complementaires.map((e, i) => (
                      <DetailItem key={i} label={e.nom} value={e.resultat} />
                    ))}
                  </DetailSection>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CaseDetailPage;
