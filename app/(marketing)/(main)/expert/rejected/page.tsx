import { getExpertDashboardData } from "@/lib/api";
import { RejectedCasesClient } from "./RejectedCasesClient";

const RejectedCasesPage = async () => {
  const data = await getExpertDashboardData();
  
  // Filtrer uniquement les cas rejetés
  const rejectedCases = data.cases.filter(c => c.status === "rejeté");
  
  return <RejectedCasesClient cases={rejectedCases} />;
};

export default RejectedCasesPage;
