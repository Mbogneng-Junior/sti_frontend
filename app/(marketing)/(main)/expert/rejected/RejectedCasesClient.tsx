"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExpertSidebar } from "@/components/expert-sidebar";
import { ClinicalCasesTable } from "@/components/expert/clinical-cases-table";
import { Bell, HelpCircle, Loader2 } from "lucide-react";
import { getExpertDashboardData, type ExpertCaseData } from "@/lib/api";

export const RejectedCasesClient = () => {
  const [cases, setCases] = useState<ExpertCaseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadCases = async () => {
        try {
            const data = await getExpertDashboardData();
            setCases(data.cases.filter(c => c.status === "rejeté"));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    loadCases();
  }, []);

  const handleReview = (caseId: string) => {
    router.push(`/expert/editor/${caseId}`);
  };

  const handleViewDetails = (caseId: string) => {
    router.push(`/expert/editor/${caseId}`);
  };

  if (isLoading) {
      return (
          <div className="flex min-h-screen bg-gray-50 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
      );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <ExpertSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cas rejetés</h1>
                <p className="text-sm text-gray-500 mt-1">Consulter les cas cliniques rejetés</p>
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
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{cases.length}</span> cas rejetés
            </p>
          </div>

          {/* Cases Table */}
          <ClinicalCasesTable 
            cases={cases}
            onReview={handleReview}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>
    </div>
  );
};
