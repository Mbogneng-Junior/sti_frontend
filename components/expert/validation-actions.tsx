"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Save, Send, AlertTriangle, CheckCircle2 } from "lucide-react";

type Props = {
  onReject: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
};

export const ValidationActions = ({ onReject, onSaveDraft, onPublish }: Props) => {
  return (
    <Card className="mt-6 border-t-4 border-t-primary">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
            <span>Toutes les modifications sont sauvegardées automatiquement</span>
          </div>

          <div className="flex items-center gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Rejeter
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Confirmer le rejet
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir rejeter ce cas clinique ?
                    Cette action est irréversible et le cas sera définitivement supprimé.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onReject}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Rejeter définitivement
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Separator orientation="vertical" className="h-8" />

            <Button variant="outline" onClick={onSaveDraft} className="gap-2">
              <Save className="h-4 w-4" />
              Sauvegarder Brouillon
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="gap-2 bg-green-600 hover:bg-green-700">
                  <Send className="h-4 w-4" />
                  Publier
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Confirmer la publication
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir publier ce cas clinique ?
                    Il sera visible par tous les étudiants de la plateforme.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onPublish}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Publier le cas
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
