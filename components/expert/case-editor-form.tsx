"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, BarChart3, AlignLeft } from "lucide-react";

export type CaseFormData = {
  title: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  introduction: string;
};

type Props = {
  initialData: CaseFormData;
  onSave: (data: CaseFormData) => void;
};

const difficultyConfig = {
  'Facile': { color: 'bg-green-100 text-green-800', label: 'Facile' },
  'Moyen': { color: 'bg-yellow-100 text-yellow-800', label: 'Moyen' },
  'Difficile': { color: 'bg-red-100 text-red-800', label: 'Difficile' },
};

export const CaseEditorForm = ({ initialData, onSave }: Props) => {
  const [formData, setFormData] = useState<CaseFormData>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    onSave(newData);
  };

  const handleDifficultyChange = (value: string) => {
    const newData = { ...formData, difficulty: value as CaseFormData['difficulty'] };
    setFormData(newData);
    onSave(newData);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Edition du Cas Clinique
            </CardTitle>
            <CardDescription>
              Modifiez les informations du cas pour les étudiants
            </CardDescription>
          </div>
          <Badge className={difficultyConfig[formData.difficulty].color}>
            {difficultyConfig[formData.difficulty].label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Titre du cas
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Fièvre inexpliquée chez un patient de 45 ans..."
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              Niveau de difficulté
            </Label>
            <Select
              value={formData.difficulty}
              onValueChange={handleDifficultyChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner la difficulté" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Facile">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Facile
                  </div>
                </SelectItem>
                <SelectItem value="Moyen">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    Moyen
                  </div>
                </SelectItem>
                <SelectItem value="Difficile">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    Difficile
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="introduction" className="flex items-center gap-2">
              <AlignLeft className="h-4 w-4 text-muted-foreground" />
              Texte d'introduction
            </Label>
            <Textarea
              id="introduction"
              name="introduction"
              value={formData.introduction}
              onChange={handleChange}
              placeholder="Présentez le contexte clinique du patient, les circonstances de consultation..."
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Ce texte sera affiché aux étudiants au début du cas clinique
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
