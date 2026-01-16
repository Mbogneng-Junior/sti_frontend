"use client";

import { useRouter } from "next/navigation";
import { ExpertSidebar } from "@/components/expert-sidebar";
import { ClinicalCasesTable } from "@/components/expert/clinical-cases-table";
import { Bell, HelpCircle } from "lucide-react";
import type { ExpertCaseData } from "@/lib/api";

type Props = {
  cases: ExpertCaseData[];
};

export const PendingCasesClient = ({ cases }: Props) => {
  const router = useRouter();

  const handleReview = (caseId: string) => {
    router.push(`/expert/editor/${caseId}`);
  };

  const handleViewDetails = (caseId: string) => {
    router.push(`/expert/${caseId}`);
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Cas en attente d&apos;examen</h1>
                <p className="text-sm text-gray-500 mt-1">Examiner et valider les cas cliniques en attente</p>
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
              <span className="font-semibold text-gray-900">{cases.length}</span> cas en attente d&apos;examen
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
