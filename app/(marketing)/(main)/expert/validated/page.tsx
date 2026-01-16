import { getExpertDashboardData } from "@/lib/api";
import { ValidatedCasesClient } from "./ValidatedCasesClient";

const ValidatedCasesPage = async () => {
  const data = await getExpertDashboardData();
  
  // Filtrer uniquement les cas validés
  const validatedCases = data.cases.filter(c => c.status === "validé");
  
  return <ValidatedCasesClient cases={validatedCases} />;
};

export default ValidatedCasesPage;
