"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { validateCase, rejectCase, type CaseReviewData } from "@/lib/api";
import { 
  Bell, 
  HelpCircle, 
  Share2, 
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar
} from "lucide-react";
import { ExpertSidebar } from "@/components/expert-sidebar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Props = {
  caseData: CaseReviewData;
};

type DecisionType = 'validate' | 'revise' | 'reject' | null;

const getStatusBadge = (status: string) => {
  switch (status) {
    case "attente":
      return (
        <Badge className="bg-orange-100 text-orange-600 border-0 font-medium">
          ⭐ En attente
        </Badge>
      );
    case "validé":
      return (
        <Badge className="bg-green-100 text-green-600 border-0 font-medium">
          ✓ Validé
        </Badge>
      );
    case "rejeté":
      return (
        <Badge className="bg-red-100 text-red-600 border-0 font-medium">
          ✕ Rejeté
        </Badge>
      );
    default:
      return null;
  }
};

const getLabStatusBadge = (status: string) => {
  switch (status) {
    case "High":
      return <Badge className="bg-red-100 text-red-600 border-0">Élevé</Badge>;
    case "Elevated":
      return <Badge className="bg-yellow-100 text-yellow-600 border-0">Élevé</Badge>;
    case "Normal":
      return <Badge className="bg-green-100 text-green-600 border-0">Normal</Badge>;
    default:
      return null;
  }
};

export const CaseReviewClient = ({ caseData }: Props) => {
  const [isValidating, setIsValidating] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [decision, setDecision] = useState<DecisionType>(null);
  const [notes, setNotes] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!decision) {
      alert("Veuillez sélectionner une décision");
      return;
    }

    if (decision === 'validate') {
      if (!confirm("Êtes-vous sûr de vouloir valider ce cas clinique ?")) return;
      setIsValidating(true);
      try {
        await validateCase(caseData.id);
        alert("Cas validé avec succès !");
        router.push("/expert/dashboard");
      } catch (error) {
        alert(`Erreur lors de la validation : ${error}`);
      } finally {
        setIsValidating(false);
      }
    } else if (decision === 'reject') {
      if (!confirm("Êtes-vous sûr de vouloir rejeter ce cas clinique ?")) return;
      setIsRejecting(true);
      try {
        await rejectCase(caseData.id);
        alert("Cas rejeté avec succès !");
        router.push("/expert/dashboard");
      } catch (error) {
        alert(`Erreur lors du rejet : ${error}`);
      } finally {
        setIsRejecting(false);
      }
    } else if (decision === 'revise') {
      alert("Fonctionnalité de révision en cours de développement");
    }
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-5">
              {/* Case Title */}
              <Card className="border-0 shadow-[0_2px_15px_rgb(0,0,0,0.08)] rounded-xl">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                        {caseData.title}
                      </CardTitle>
                      {getStatusBadge(caseData.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900">
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Patient Info */}
              <Card className="border-0 shadow-[0_2px_15px_rgb(0,0,0,0.08)] rounded-xl">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-gray-900">Informations du patient</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Sexe</p>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <p className="font-medium text-gray-900">
                          {caseData.patientInfo.gender === "Male" ? "Homme" : "Femme"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Âge</p>
                      <p className="font-medium text-gray-900">{caseData.patientInfo.age} ans</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">IMC</p>
                      <p className="font-medium text-gray-900">{caseData.patientInfo.bmi}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">ID Patient</p>
                      <p className="font-medium text-gray-900">{caseData.patientInfo.patientId}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Patient History */}
              <Card className="border-0 shadow-[0_2px_15px_rgb(0,0,0,0.08)] rounded-xl">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-600" />
                    Historique du patient
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {caseData.patientHistory}
                  </p>
                </CardContent>
              </Card>

              {/* Past Medical History */}
              <Card className="border-0 shadow-[0_2px_15px_rgb(0,0,0,0.08)] rounded-xl">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    Antécédents médicaux
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {caseData.pastMedicalHistory.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Laboratory Results */}
              <Card className="border-0 shadow-[0_2px_15px_rgb(0,0,0,0.08)] rounded-xl">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-gray-900">Résultats de laboratoire</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                          <TableHead className="font-semibold text-gray-700">Nom du test</TableHead>
                          <TableHead className="font-semibold text-gray-700">Résultat</TableHead>
                          <TableHead className="font-semibold text-gray-700">Plage de référence</TableHead>
                          <TableHead className="font-semibold text-gray-700">Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {caseData.laboratoryResults.map((result, index) => (
                          <TableRow key={index} className="hover:bg-gray-50">
                            <TableCell className="font-medium text-gray-900">{result.testName}</TableCell>
                            <TableCell className={
                              result.status === "High" || result.status === "Elevated" 
                                ? "text-red-600 font-semibold" 
                                : "text-gray-900"
                            }>
                              {result.result}
                            </TableCell>
                            <TableCell className="text-gray-600 text-sm">{result.referenceRange}</TableCell>
                            <TableCell>{getLabStatusBadge(result.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar - Validation Panel */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6 border-0 shadow-[0_2px_15px_rgb(0,0,0,0.08)] rounded-xl">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-gray-900">Validation d&apos;expert</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Examinez le cas et prenez une décision
                  </p>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Decision Radio Group */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Décision</Label>
                    <RadioGroup value={decision || ""} onValueChange={(value: string) => setDecision(value as DecisionType)}>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <RadioGroupItem value="validate" id="validate" className="mt-0.5" />
                          <Label htmlFor="validate" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-gray-900">Valider le cas</span>
                            </div>
                            <p className="text-xs text-gray-500">
                              Les données sont précises et bien documentées
                            </p>
                          </Label>
                        </div>

                        <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <RadioGroupItem value="revise" id="revise" className="mt-0.5" />
                          <Label htmlFor="revise" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="h-4 w-4 text-yellow-600" />
                              <span className="font-medium text-gray-900">Nécessite une révision</span>
                            </div>
                            <p className="text-xs text-gray-500">
                              Certaines informations doivent être clarifiées
                            </p>
                          </Label>
                        </div>

                        <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <RadioGroupItem value="reject" id="reject" className="mt-0.5" />
                          <Label htmlFor="reject" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="font-medium text-gray-900">Rejeter le cas</span>
                            </div>
                            <p className="text-xs text-gray-500">
                              Les données ne répondent pas aux critères de diagnostic
                            </p>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Quality Check */}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-2">Contrôle qualité</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Anonymat du patient préservé</span>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Valeurs de laboratoire complètes</span>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  </div>

                  {/* Expert Notes */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Notes d&apos;expert
                    </Label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      rows={4}
                      placeholder="Ajoutez des commentaires ou des observations pour les étudiants ou le système..."
                    />
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={!decision || isValidating || isRejecting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                  >
                    {isValidating || isRejecting ? (
                      <>
                        <Clock className="h-5 w-5 animate-spin mr-2" />
                        Traitement en cours...
                      </>
                    ) : (
                      "Soumettre la décision"
                    )}
                  </Button>

                  {/* Guideline Reminder */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">
                      <strong>Rappel :</strong> Assurez-vous que toutes les informations sont exactes avant de valider. Les cas validés seront utilisés pour la formation des étudiants.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseReviewClient;
