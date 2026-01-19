"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Save, Send, AlertTriangle, CheckCircle2, Clock, Loader2 } from "lucide-react";

// Parties du cas clinique qui peuvent être concernées par un rejet
const PARTIES_CAS = [
  "Données personnelles",
  "Mode de vie",
  "Antécédents médicaux",
  "Symptômes",
  "Diagnostic physique",
  "Examens complémentaires",
  "Traitement",
  "Diagnostic final",
];

type Props = {
  onReject: (raison: string, partiesConcernees: string[], emailNotification: string) => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onSetEnCours: () => void;
  isLoading?: boolean;
};

export const ValidationActions = ({
  onReject,
  onSaveDraft,
  onPublish,
  onSetEnCours,
  isLoading = false
}: Props) => {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectRaison, setRejectRaison] = useState("");
  const [rejectEmail, setRejectEmail] = useState("");
  const [selectedParties, setSelectedParties] = useState<string[]>([]);

  const handleRejectSubmit = () => {
    if (!rejectRaison.trim()) {
      alert("Veuillez indiquer la raison du rejet");
      return;
    }
    onReject(rejectRaison, selectedParties, rejectEmail);
    setRejectDialogOpen(false);
    // Reset form
    setRejectRaison("");
    setRejectEmail("");
    setSelectedParties([]);
  };

  const togglePartie = (partie: string) => {
    setSelectedParties(prev =>
      prev.includes(partie)
        ? prev.filter(p => p !== partie)
        : [...prev, partie]
    );
  };

  return (
    <Card className="mt-6 border-t-4 border-t-primary">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
            <span>Toutes les modifications sont sauvegardées automatiquement</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Bouton Rejeter avec formulaire détaillé */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="gap-2" disabled={isLoading}>
                  <Trash2 className="h-4 w-4" />
                  Rejeter
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Formulaire de rejet
                  </DialogTitle>
                  <DialogDescription>
                    Veuillez remplir ce formulaire pour rejeter le cas clinique.
                    Un email sera envoyé à l'adresse indiquée.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {/* Raison du rejet (obligatoire) */}
                  <div className="space-y-2">
                    <Label htmlFor="raison">Raison du rejet *</Label>
                    <Textarea
                      id="raison"
                      placeholder="Décrivez la raison du rejet..."
                      value={rejectRaison}
                      onChange={(e) => setRejectRaison(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Parties concernées */}
                  <div className="space-y-2">
                    <Label>Parties concernées</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {PARTIES_CAS.map((partie) => (
                        <label
                          key={partie}
                          className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${
                            selectedParties.includes(partie)
                              ? "bg-destructive/10 border-destructive"
                              : "hover:bg-muted"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedParties.includes(partie)}
                            onChange={() => togglePartie(partie)}
                            className="rounded"
                          />
                          <span className="text-sm">{partie}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Email de notification */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email de notification (Fultang)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@fultang.com"
                      value={rejectEmail}
                      onChange={(e) => setRejectEmail(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Un email de notification sera envoyé à cette adresse
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleRejectSubmit}
                    disabled={!rejectRaison.trim() || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Confirmer le rejet
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Separator orientation="vertical" className="h-8" />

            {/* Bouton En Cours */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-amber-500 text-amber-600 hover:bg-amber-50" disabled={isLoading}>
                  <Clock className="h-4 w-4" />
                  En cours
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                    Mettre en cours
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Ce cas sera marqué comme "en cours de traitement".
                    Vous pourrez continuer à le réviser avant de le valider ou le rejeter.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onSetEnCours}
                    className="bg-amber-500 hover:bg-amber-600"
                  >
                    Mettre en cours
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Bouton Sauvegarder */}
            <Button variant="outline" onClick={onSaveDraft} className="gap-2" disabled={isLoading}>
              <Save className="h-4 w-4" />
              Sauvegarder
            </Button>

            {/* Bouton Publier */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="gap-2 bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  <Send className="h-4 w-4" />
                  Valider
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Confirmer la validation
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir valider et publier ce cas clinique ?
                    Il sera visible par tous les étudiants de la plateforme.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onPublish}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Valider et publier
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
