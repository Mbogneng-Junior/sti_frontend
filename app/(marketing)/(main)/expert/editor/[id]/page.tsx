import { getCaseById } from "@/lib/api";
import { EditorClient } from "./EditorClient";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { FileEdit, Hash } from "lucide-react";

const transformApiToFormData = (apiData: any) => {
  return {
    title: apiData.motif_consultation || "Titre non defini",
    difficulty: "Moyen" as const,
    introduction: `Patient de ${apiData.donnees_personnelles?.age} ans, de sexe ${apiData.donnees_personnelles?.sexe}.`,
  };
};

const CaseEditorPage = async ({ params }: { params: { id: string } }) => {
  let caseData;
  try {
    caseData = await getCaseById(params.id);
  } catch (error) {
    console.error(error);
    notFound();
  }

  const initialFormData = transformApiToFormData(caseData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <FileEdit className="h-8 w-8 text-primary" />
              Edition du Cas
            </h1>
            <p className="text-muted-foreground mt-1">
              Verifiez et modifiez les informations extraites automatiquement
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2 text-sm font-mono">
            <Hash className="h-4 w-4" />
            {params.id}
          </Badge>
        </div>

        <EditorClient
          caseId={params.id}
          initialRawData={caseData}
          initialFormData={initialFormData}
        />
      </div>
    </div>
  );
};

export default CaseEditorPage;
