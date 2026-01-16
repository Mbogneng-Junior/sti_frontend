import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth"; // Importez le provider que nous venons de créer
import { Toaster } from "sonner"; // Composant pour afficher les notifications (ex: "Inscription réussie")

export const metadata = {
  title: "FultangMed - Apprentissage Médical",
  description: "Plateforme d'apprentissage médical intelligent.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // On retire ClerkProvider
    <html lang="fr">
      <body>
        {/* On enveloppe tout avec AuthProvider */}
        <AuthProvider>
          <Toaster /> {/* Ajout du composant de notification */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}