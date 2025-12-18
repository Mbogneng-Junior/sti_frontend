"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Clock, AlertCircle } from "lucide-react";

export type CaseData = {
  id: string;
  title: string;
  date: string;
  aiConfidence: number;
};

type Props = {
  cases: CaseData[];
};

const getConfidenceBadge = (confidence: number) => {
  if (confidence >= 80) {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Haute</Badge>;
  } else if (confidence >= 50) {
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Moyenne</Badge>;
  }
  return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Faible</Badge>;
};

export const CasesQueueTable = ({ cases }: Props) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">File d'attente de validation</CardTitle>
            <CardDescription>
              {cases.length} cas en attente de révision par un expert
            </CardDescription>
          </div>
          {cases.length > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {cases.length} en attente
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {cases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">Aucun cas en attente</p>
            <p className="text-sm text-muted-foreground mt-1">
              Les nouveaux cas apparaîtront ici automatiquement
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre du Cas</TableHead>
                <TableHead>Date de Soumission</TableHead>
                <TableHead>Confiance IA</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((caseItem) => (
                <TableRow key={caseItem.id} className="group">
                  <TableCell>
                    <p className="font-medium">{caseItem.title}</p>
                    <p className="text-xs text-muted-foreground">ID: {caseItem.id}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {new Date(caseItem.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2 min-w-[120px]">
                      <div className="flex items-center justify-between">
                        {getConfidenceBadge(caseItem.aiConfidence)}
                        <span className="text-sm font-medium">{caseItem.aiConfidence}%</span>
                      </div>
                      <Progress value={caseItem.aiConfidence} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/expert/editor/${caseItem.id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Vérifier
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
