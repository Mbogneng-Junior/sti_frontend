"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "@/components/sidebar";
import {
  Plus,
  ChevronRight,
  Loader2
} from "lucide-react";

// Donnees simulees pour le profil de competences
const PROFICIENCY_DATA = [
  {
    id: "clinical_knowledge",
    label: "Clinical Knowledge",
    value: 85,
    color: "bg-red-500",
    description: "Advanced mastery of core concepts"
  },
  {
    id: "differential_diagnosis",
    label: "Differential Diagnosis",
    value: 64,
    color: "bg-blue-500",
    description: "Intermediate level requires broader testing"
  },
  {
    id: "communication_skills",
    label: "Communication Skills",
    value: 72,
    color: "bg-amber-500",
    description: "Improving, focus on patient rapport"
  },
  {
    id: "empathy_ethics",
    label: "Empathy & Ethics",
    value: 91,
    color: "bg-green-500",
    description: "Excellent patient-centric focus"
  }
];

// Donnees simulees pour les consultations
const CONSULTATIONS_DATA = [
  {
    id: "1",
    date: "Oct 24, 2023",
    time: "2:30 PM",
    patientName: "James Miller",
    caseType: "Chronic Abdominal Pain",
    score: 88,
    avatar: "/avatars/patient1.png"
  },
  {
    id: "2",
    date: "Oct 21, 2023",
    time: "09:15 AM",
    patientName: "Sarah Connor",
    caseType: "Acute Respiratory Distress",
    score: 82,
    avatar: "/avatars/patient2.png"
  },
  {
    id: "3",
    date: "Oct 18, 2023",
    time: "11:00 AM",
    patientName: "Robert Chen",
    caseType: "Post-Surgical Followup",
    score: 94,
    avatar: "/avatars/patient3.png"
  }
];

const ProficiencyBar = ({
  label,
  value,
  color,
  description
}: {
  label: string;
  value: number;
  color: string;
  description: string;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className={`text-sm font-semibold ${
        value >= 80 ? 'text-green-600' : value >= 60 ? 'text-amber-600' : 'text-red-600'
      }`}>
        {value}%
      </span>
    </div>
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-500`}
        style={{ width: `${value}%` }}
      />
    </div>
    <p className="text-xs text-gray-500">{description}</p>
  </div>
);

export default function LearnDashboardPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartConsultation = () => {
    setIsStarting(true);
    // Rediriger vers la selection de domaine ou directement vers une simulation
    router.push("/learn/paludisme");
  };

  const handleViewConsultation = (consultationId: string) => {
    router.push(`/consultation/${consultationId}/feedback`);
  };

  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-100">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Welcome back, {user?.nom?.split(' ')[0] || 'Alex'}. Here is your current clinical proficiency overview.
                </p>
              </div>
              <Button
                onClick={handleStartConsultation}
                disabled={isStarting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-blue-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/30"
              >
                {isStarting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Start New Consultation
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-8 py-6 space-y-6">
          {/* Learner Profile & Proficiency */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
                Learner Profile & Proficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {PROFICIENCY_DATA.map((item) => (
                  <ProficiencyBar
                    key={item.id}
                    label={item.label}
                    value={item.value}
                    color={item.color}
                    description={item.description}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* My Consultations */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  My Consultations
                </CardTitle>
                <Link
                  href="/consultations/history"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
                >
                  View All History
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 px-6 py-3 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div>Date</div>
                <div>Patient / Case</div>
                <div>Score</div>
                <div>Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-50">
                {CONSULTATIONS_DATA.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                  >
                    {/* Date */}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{consultation.date}</p>
                      <p className="text-xs text-gray-500">{consultation.time}</p>
                    </div>

                    {/* Patient / Case */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={consultation.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                          {consultation.patientName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{consultation.patientName}</p>
                        <p className="text-xs text-gray-500">{consultation.caseType}</p>
                      </div>
                    </div>

                    {/* Score */}
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold ${
                        consultation.score >= 90
                          ? 'bg-green-50 text-green-700'
                          : consultation.score >= 80
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700'
                      }`}>
                        {consultation.score} / 100
                      </span>
                    </div>

                    {/* Actions */}
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewConsultation(consultation.id)}
                        className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              <div className="px-6 py-4 text-center border-t border-gray-100">
                <button className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">
                  + Load More History
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
