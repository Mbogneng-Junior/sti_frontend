"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardStatCard } from "@/components/expert/dashboard-stat-card";
import { ClinicalCasesTable } from "@/components/expert/clinical-cases-table";
import { type DashboardData } from "@/lib/api";
import { ExpertSidebar } from "@/components/expert-sidebar";
import {
  FileText,
  Clock,
  CheckCircle2,
  Bell,
  HelpCircle
} from "lucide-react";

type Props = {
  initialData: DashboardData;
};

export const DashboardClient = ({ initialData }: Props) => {
  const [data] = useState(initialData);
  const router = useRouter();

  const handleReview = (caseId: string) => {
    router.push(`/expert/editor/${caseId}`);
  };

  const handleViewDetails = (caseId: string) => {
    router.push(`/expert/editor/${caseId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <ExpertSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-[0_1px_3px_rgb(0,0,0,0.06)]">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tableau de bord de gestion des cas</h1>
                <p className="text-sm text-gray-500 mt-1">Examiner et valider les cas cliniques extraits</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <HelpCircle className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <DashboardStatCard
              title="Total des cas traités"
              value={data.kpis.totalCases.toLocaleString()}
              icon={FileText}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
              trend={data.kpis.trendTotal}
            />
            <DashboardStatCard
              title="En attente d'examen"
              value={data.kpis.pendingCases}
              icon={Clock}
              iconColor="text-orange-600"
              iconBgColor="bg-orange-100"
              trend={data.kpis.trendPending}
            />
            <DashboardStatCard
              title="Cas validés"
              value={data.kpis.validatedCases.toLocaleString()}
              icon={CheckCircle2}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
              trend={data.kpis.trendValidated}
            />
          </div>

          {/* Cases Table */}
          <ClinicalCasesTable 
            cases={data.cases}
            onReview={handleReview}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>
    </div>
  );
};
