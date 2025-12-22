"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RawDataViewer } from "@/components/expert/raw-data-viewer";
import { CaseEditorForm, type CaseFormData } from "@/components/expert/case-editor-form";
import { ValidationActions } from "@/components/expert/validation-actions";
import { updateCase, publishCase, rejectCase } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, FileEdit, Eye } from "lucide-react";

type Props = {
  caseId: string;
  initialRawData: object;
  initialFormData: CaseFormData;
};

export const EditorClient = ({ caseId, initialRawData, initialFormData }: Props) => {
  const [formData, setFormData] = useState(initialFormData);
  const router = useRouter();

  const handleSave = (data: CaseFormData) => {
    setFormData(data);
    console.log("Form data updated in state", data);
  };

  const handleReject = async () => {
    try {
      await rejectCase(caseId);
      alert("Cas rejete avec succes.");
      router.push("/expert/dashboard");
    } catch (error) {
      alert(`Erreur lors du rejet : ${error}`);
    }
  };

  const handleSaveDraft = async () => {
    try {
      await updateCase(caseId, formData);
      alert("Brouillon sauvegarde avec succes.");
    } catch (error) {
      alert(`Erreur lors de la sauvegarde : ${error}`);
    }
  };

  const handlePublish = async () => {
    try {
      await publishCase(caseId);
      alert("Cas publie avec succes.");
      router.push("/expert/library");
    } catch (error) {
      alert(`Erreur lors de la publication : ${error}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Desktop: Side by side */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-6">
        <RawDataViewer data={initialRawData} />
        <CaseEditorForm initialData={formData} onSave={handleSave} />
      </div>

      {/* Mobile/Tablet: Tabs */}
      <div className="lg:hidden">
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor" className="gap-2">
              <FileEdit className="h-4 w-4" />
              Editeur
            </TabsTrigger>
            <TabsTrigger value="raw" className="gap-2">
              <Database className="h-4 w-4" />
              Donnees brutes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="mt-4">
            <CaseEditorForm initialData={formData} onSave={handleSave} />
          </TabsContent>
          <TabsContent value="raw" className="mt-4">
            <RawDataViewer data={initialRawData} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Apercu du cas</h3>
            <Badge variant="secondary" className="ml-auto">
              {formData.difficulty}
            </Badge>
          </div>
          <div className="prose prose-sm max-w-none">
            <h4 className="text-lg font-medium text-primary">{formData.title}</h4>
            <p className="text-muted-foreground">{formData.introduction}</p>
          </div>
        </CardContent>
      </Card>

      <ValidationActions
        onReject={handleReject}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
      />
    </div>
  );
};
