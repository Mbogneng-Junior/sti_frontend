import { getExpertDashboardData } from "@/lib/api";
import { PendingCasesClient } from "./PendingCasesClient";

const PendingCasesPage = async () => {
  const data = await getExpertDashboardData();
  
  // Filtrer uniquement les cas en attente
  const pendingCases = data.cases.filter(c => c.status === "attente");
  
  return <PendingCasesClient cases={pendingCases} />;
};

export default PendingCasesPage;
