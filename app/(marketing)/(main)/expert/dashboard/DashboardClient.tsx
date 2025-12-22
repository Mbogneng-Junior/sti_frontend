"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatCard } from "@/components/expert/stat-card";
import { CasesQueueTable, type CaseData } from "@/components/expert/cases-queue-table";
import { forceExtraction } from "@/lib/api";
import {
  HardHat,
  CheckCircle,
  ListTodo,
  TrendingUp,
  RefreshCw,
  Activity,
  Loader2
} from "lucide-react";

type DashboardData = {
  kpis: {
    pendingCases: number;
    validatedCases: number;
    studentSuccessRate: string;
  };
  cases: CaseData[];
};

type Props = {
  initialData: DashboardData;
};

export const DashboardClient = ({ initialData }: Props) => {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const handleForceExtraction = async () => {
    setIsLoading(true);
    try {
      const result = await forceExtraction();
      alert(`Extraction reussie : ${result.message}\nLes donnees seront rafraichies.`);
    } catch (error) {
      console.error(error);
      alert(`Echec de l'extraction : ${error instanceof Error ? error.message : "Erreur inconnue"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Expert</h1>
            <p className="text-muted-foreground mt-1">
              Gerez et validez les cas cliniques extraits automatiquement
            </p>
          </div>
          <Button
            onClick={handleForceExtraction}
            disabled={isLoading}
            size="lg"
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isLoading ? "Extraction en cours..." : "Forcer l'extraction Fultang"}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <StatCard
            title="Cas en attente"
            value={data.kpis.pendingCases}
            icon={ListTodo}
            trend={data.kpis.pendingCases > 0 ? { value: data.kpis.pendingCases, isPositive: false } : undefined}
          />
          <StatCard
            title="Cas Valides"
            value={data.kpis.validatedCases}
            icon={CheckCircle}
          />
          <StatCard
            title="Taux de reussite etudiants"
            value={data.kpis.studentSuccessRate}
            icon={TrendingUp}
          />
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Actions Rapides</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">
                {data.cases.length} cas a traiter
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Valider tous les cas haute confiance
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <HardHat className="h-4 w-4" />
                Voir les statistiques detaillees
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cases Queue */}
        <CasesQueueTable cases={data.cases} />
      </div>
    </div>
  );
};
