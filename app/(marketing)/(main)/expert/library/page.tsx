import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCases } from "@/lib/api";
import { z } from "zod";
import { BookOpen, Eye, User, AlertCircle, Library } from "lucide-react";

const CaseSchemaForPage = z.object({
  id_unique: z.string(),
  motif_consultation: z.string(),
  donnees_patient: z.object({ age: z.number() })
});
type PublishedCaseData = z.infer<typeof CaseSchemaForPage>;

const ExpertLibraryPage = async () => {
  let cases: PublishedCaseData[] = [];
  let fetchError: string | null = null;

  try {
    cases = await getCases({});
  } catch (error) {
    console.error("Erreur lors du chargement de la bibliotheque:", error);
    fetchError = "Impossible de charger la bibliotheque de cas. L'API est peut-etre indisponible.";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Library className="h-8 w-8 text-primary" />
              Bibliotheque des Cas
            </h1>
            <p className="text-muted-foreground mt-1">
              Tous les cas cliniques disponibles pour les etudiants
            </p>
          </div>
          <Badge variant="secondary" className="text-sm flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {cases.length} cas publies
          </Badge>
        </div>

        {/* Error State */}
        {fetchError && (
          <Card className="border-destructive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 justify-center text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p>{fetchError}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Table */}
        {!fetchError && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Cas Cliniques Disponibles</CardTitle>
              <CardDescription>
                Liste de tous les cas valides et publies sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cases.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-4 mb-4">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium text-muted-foreground">
                    Aucun cas dans la bibliotheque
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Les cas publies apparaitront ici
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre du Cas</TableHead>
                      <TableHead>Age Patient</TableHead>
                      <TableHead>Difficulte</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cases.map((caseItem) => (
                      <TableRow key={caseItem.id_unique} className="group">
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{caseItem.motif_consultation}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              ID: {caseItem.id_unique}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{caseItem.donnees_patient?.age ?? "?"} ans</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Non definie
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/expert/editor/${caseItem.id_unique}`}>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Eye className="h-4 w-4" />
                              Consulter
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
        )}
      </div>
    </div>
  );
};

export default ExpertLibraryPage;
