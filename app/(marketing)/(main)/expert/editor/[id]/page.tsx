import { getCaseForReview } from "@/lib/api";
import CaseReviewClient from "./CaseReviewClient";
import { notFound } from "next/navigation";

// 1. Note le changement de type ici : params est une Promise
const CaseReviewPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  
  // 2. IMPORTANT : On doit attendre (await) la résolution des paramètres
  const { id } = await params;

  let caseData;
  try {
    // 3. On utilise la variable 'id' que l'on vient d'extraire
    caseData = await getCaseForReview(id);
  } catch (error) {
    console.error("Erreur lors du chargement du cas:", error);
    notFound();
  }

  return <CaseReviewClient caseData={caseData} />;
};

export default CaseReviewPage;