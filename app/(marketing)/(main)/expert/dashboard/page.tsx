import { getExpertDashboardData } from "@/lib/api";
import { DashboardClient } from "./DashboardClient";

const ExpertDashboardPage = async () => {
  // En tant que Composant Serveur, on peut appeler directement l'API.
  // Pour l'instant, cela appelle la fonction placeholder dans api.ts.
  const initialData = await getExpertDashboardData();

  return <DashboardClient initialData={initialData} />;
};

export default ExpertDashboardPage;
