import CaseReviewClient from "./CaseReviewClient";

// 1. Note le changement de type ici : params est une Promise
const CaseReviewPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  
  // 2. IMPORTANT : On doit attendre (await) la résolution des paramètres
  const { id } = await params;

  return <CaseReviewClient caseId={id} />;
};

export default CaseReviewPage;