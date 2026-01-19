"use client";

import { useState, useEffect } from "react";
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
import { validateCase, rejectCase, getCaseForReview, type CaseReviewData } from "@/lib/api";
import { 
  User, Activity, Shield, Droplets, Plane, 
  MapPin, Loader2, Clock, Calendar, Stethoscope, Pill, AlertTriangle, Download
} from "lucide-react";
import { ExpertSidebar } from "@/components/expert-sidebar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Props = {
  caseId: string;
};

type DecisionType = 'validate' | 'revise' | 'reject' | null;

const getStatusBadge = (status: string) => {
  switch (status) {
    case "attente":
      return <Badge className="bg-orange-100 text-orange-600 border-0 font-medium">⭐ En attente</Badge>;
    case "validé":
      return <Badge className="bg-green-100 text-green-600 border-0 font-medium">✓ Validé</Badge>;
    case "rejeté":
      return <Badge className="bg-red-100 text-red-600 border-0 font-medium">✕ Rejeté</Badge>;
    default: return null;
  }
};

const getLabStatusBadge = (status: string) => {
  switch (status) {
    case "High": return <Badge className="bg-red-100 text-red-600 border-0">Critique</Badge>;
    case "Elevated": return <Badge className="bg-yellow-100 text-yellow-600 border-0">Élevé</Badge>;
    case "Normal": return <Badge className="bg-green-100 text-green-600 border-0">Normal</Badge>;
    default: return null;
  }
};

export const CaseReviewClient = ({ caseId }: Props) => {
  const [caseData, setCaseData] = useState<CaseReviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [decision, setDecision] = useState<DecisionType>(null);
  const [notes, setNotes] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadCase = async () => {
        try {
            const data = await getCaseForReview(caseId);
            setCaseData(data);
        } catch (error) {
            console.error("Erreur chargement cas:", error);
            // Gérer l'erreur (ex: redirect ou message)
        } finally {
            setIsLoading(false);
        }
    };
    loadCase();
  }, [caseId]);

  const handleSubmit = async () => {
    if (!caseData) return;

    if (!decision) {
      alert("Veuillez sélectionner une décision");
      return;
    }
    // ... (Logique identique à ton code précédent) ...
    if (decision === 'validate') {
      if (!confirm("Valider ce cas ?")) return;
      setIsValidating(true);
      try { await validateCase(caseData.id); router.push("/expert/dashboard"); } 
      catch (e) { alert(e); } finally { setIsValidating(false); }
    } else if (decision === 'reject') {
      if (!confirm("Rejeter ce cas ?")) return;
      setIsRejecting(true);
      try { await rejectCase(caseData.id); router.push("/expert/dashboard"); } 
      catch (e) { alert(e); } finally { setIsRejecting(false); }
    }
  };

  const handleDownload = () => {
      if (!caseData) return;
      const jsonString = JSON.stringify(caseData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `case-${caseData.id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  if (isLoading) {
      return (
          <div className="flex h-screen items-center justify-center bg-gray-50">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
      );
  }

  if (!caseData) return <div>Erreur de chargement du cas.</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ExpertSidebar />

      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Révision de Cas Clinique</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">ID: {caseData.id}</span>
                <span>•</span>
                <span>Généré le {new Date(caseData.createdDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-2">
               <Button onClick={handleDownload} variant="outline" size="sm" className="hidden sm:flex">
                  <Download className="h-4 w-4 mr-2" /> Exporter JSON
               </Button>
               {getStatusBadge(caseData.status)}
            </div>
          </div>
        </header>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* COLONNE GAUCHE : DONNÉES CLINIQUES */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* 1. INFORMATIONS PATIENT */}
              <Card className="border-l-4 border-l-blue-500 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-500" />
                    Identité & Socio-démographie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-xs text-gray-500 uppercase">Age / Sexe</p>
                        <p className="font-semibold text-gray-900">{caseData.patientInfo.age} ans / {caseData.patientInfo.gender === "Male" ? "H" : "F"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase">Profession</p>
                        <p className="font-medium text-gray-900">{caseData.patientInfo.profession || "Non renseigné"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase">Région</p>
                        <p className="font-medium text-gray-900 flex items-center gap-1">
                           <MapPin className="h-3 w-3" /> {caseData.patientInfo.region || "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase">Groupe Sanguin</p>
                        <Badge variant="outline">{caseData.patientInfo.groupeSanguin || "?"}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 2. MODE DE VIE & RISQUES (NOUVEAU ET CRUCIAL) */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Mode de Vie & Facteurs de Risque
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-green-800 font-medium flex gap-2">
                                <Droplets className="h-4 w-4"/> Eau de boisson
                            </span>
                            <span className="text-sm font-bold text-gray-900">{caseData.modeDeVie.qualiteEau || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-green-800 font-medium flex gap-2">
                                <Shield className="h-4 w-4"/> Moustiquaire
                            </span>
                            <span className={caseData.modeDeVie.moustiquaire ? "text-green-600 font-bold text-sm" : "text-red-600 font-bold text-sm"}>
                                {caseData.modeDeVie.moustiquaire ? "OUI" : "NON"}
                            </span>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-500 uppercase mb-2">Voyages & Addictions</p>
                        {caseData.modeDeVie.voyages.length > 0 ? (
                            caseData.modeDeVie.voyages.map((v, i) => (
                                <div key={i} className="flex gap-2 text-sm text-gray-800 mb-1">
                                    <Plane className="h-4 w-4 text-gray-400"/> {v}
                                </div>
                            ))
                        ) : <p className="text-sm text-gray-400 italic">Aucun voyage récent</p>}
                        
                        {caseData.modeDeVie.addictions.length > 0 && (
                             <div className="mt-2 pt-2 border-t border-gray-200">
                                {caseData.modeDeVie.addictions.map((a, i) => (
                                    <Badge key={i} variant="secondary" className="mr-1">{a}</Badge>
                                ))}
                             </div>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 3. HISTOIRE & ANTÉCÉDENTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-600"/> Histoire de la maladie
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-medium">
                        &quot;{caseData.title}&quot;
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        {caseData.patientHistory}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-600"/> Antécédents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {caseData.pastMedicalHistory.length > 0 ? (
                          <ul className="space-y-1">
                            {caseData.pastMedicalHistory.map((item, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-blue-500 mt-1">•</span> {item}
                              </li>
                            ))}
                          </ul>
                      ) : <p className="text-sm text-gray-400 italic">Aucun antécédent notable</p>}
                    </CardContent>
                  </Card>
              </div>

              {/* 4. EXAMEN PHYSIQUE (NOUVEAU) */}
              <Card className="shadow-sm border-t-4 border-t-purple-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-purple-600" />
                    Examen Physique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {caseData.diagnosticPhysique.length > 0 ? (
                        caseData.diagnosticPhysique.map((diag, idx) => (
                            <div key={idx} className="bg-purple-50 p-3 rounded border border-purple-100">
                                <p className="text-xs font-bold text-purple-700 uppercase">{diag.nom}</p>
                                <p className="text-sm font-medium text-gray-900">{diag.resultat}</p>
                            </div>
                        ))
                    ) : <p className="text-gray-500 italic">Données non disponibles</p>}
                  </div>
                </CardContent>
              </Card>

              {/* 5. PARACLINIQUE (LABO) */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Résultats Paracliniques</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Examen</TableHead>
                        <TableHead>Résultat</TableHead>
                        <TableHead>Normale</TableHead>
                        <TableHead>Interprétation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {caseData.laboratoryResults.map((res, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{res.testName}</TableCell>
                          <TableCell className={res.status === "High" ? "text-red-600 font-bold" : ""}>
                            {res.result}
                          </TableCell>
                          <TableCell className="text-gray-500 text-xs">{res.referenceRange}</TableCell>
                          <TableCell>{getLabStatusBadge(res.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* 6. TRAITEMENT EN COURS (NOUVEAU) */}
              {caseData.traitementEnCours.length > 0 && (
                  <Card className="shadow-sm bg-slate-50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Pill className="h-4 w-4 text-slate-600"/> Traitements en cours
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {caseData.traitementEnCours.map((t, i) => (
                                <div key={i} className="flex justify-between items-center bg-white p-2 rounded border">
                                    <span className="font-medium text-sm">{t.nom}</span>
                                    <span className="text-xs text-gray-500">{t.posologie || "Posologie non précisée"}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                  </Card>
              )}

            </div>

            {/* COLONNE DROITE : VALIDATION */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                
                {/* BLOC PEDAGOGIQUE (VISIBLE POUR L'EXPERT) */}
                <Card className="bg-indigo-50 border-indigo-100 border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-indigo-800 uppercase flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4"/> Données Cachées (Solution)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div>
                            <span className="font-semibold text-indigo-900">Diagnostic Final :</span>
                            <p className="text-indigo-700">{caseData.diagnosticFinal || "Non défini"}</p>
                        </div>
                        <div>
                            <span className="font-semibold text-indigo-900">Niveau :</span>
                            <Badge variant="outline" className="ml-2 bg-white text-indigo-700">{caseData.niveauDifficulte}</Badge>
                        </div>
                        <div>
                            <span className="font-semibold text-indigo-900">Objectifs :</span>
                            <ul className="list-disc list-inside text-indigo-700 text-xs mt-1">
                                {caseData.objectifsPedagogiques.map((o, i) => <li key={i}>{o}</li>)}
                            </ul>
                        </div>

                         {/* NOUVEAU : Indices Cliniques */}
                        {caseData.indicesCliniques && caseData.indicesCliniques.length > 0 && (
                            <div>
                                <span className="font-semibold text-indigo-900 flex items-center gap-1">
                                    💡 Indices Clés :
                                </span>
                                <ul className="list-disc list-inside text-indigo-700 mt-1 pl-1 space-y-0.5">
                                    {caseData.indicesCliniques.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        )}

                        {/* NOUVEAU : Erreurs à éviter */}
                        {caseData.erreursCourantes && caseData.erreursCourantes.length > 0 && (
                            <div>
                                <span className="font-semibold text-red-800 flex items-center gap-1">
                                    ⚠️ Pièges à éviter :
                                </span>
                                <ul className="list-disc list-inside text-red-700 mt-1 pl-1 space-y-0.5">
                                    {caseData.erreursCourantes.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        )}

                    </CardContent>
                </Card>

                {/* BLOC VALIDATION */}
                <Card className="shadow-md border-0 ring-1 ring-gray-200">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Validation Expert</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <RadioGroup value={decision || ""} onValueChange={(v) => setDecision(v as DecisionType)}>
                      
                      <div className={`flex items-start space-x-3 p-3 rounded-lg border transition-all ${decision === 'validate' ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50 border-transparent'}`}>
                        <RadioGroupItem value="validate" id="validate" className="mt-1" />
                        <Label htmlFor="validate" className="cursor-pointer">
                          <span className="font-semibold text-gray-900 block">Valider le cas</span>
                          <span className="text-xs text-gray-500">Données cohérentes et complètes. Prêt pour le LLM.</span>
                        </Label>
                      </div>

                      <div className={`flex items-start space-x-3 p-3 rounded-lg border transition-all ${decision === 'reject' ? 'bg-red-50 border-red-200' : 'hover:bg-gray-50 border-transparent'}`}>
                        <RadioGroupItem value="reject" id="reject" className="mt-1" />
                        <Label htmlFor="reject" className="cursor-pointer">
                          <span className="font-semibold text-gray-900 block">Rejeter le cas</span>
                          <span className="text-xs text-gray-500">Incohérences médicales ou données manquantes.</span>
                        </Label>
                      </div>

                    </RadioGroup>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Commentaire (Optionnel)</Label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        rows={3}
                        placeholder="Note pour l'équipe technique..."
                      />
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={!decision || isValidating || isRejecting}
                      className={`w-full ${decision === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      {isValidating || isRejecting ? "Traitement..." : "Confirmer la décision"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseReviewClient;