import { getCaseForReview } from "@/lib/api";
import CaseReviewClient from "./CaseReviewClient";
import { notFound } from "next/navigation";

const CaseReviewPage = async ({ params }: { params: { id: string } }) => {
  let caseData;
  try {
    caseData = await getCaseForReview(params.id);
  } catch (error) {
    console.error(error);
    notFound();
  }

  return <CaseReviewClient caseData={caseData} />;
};

export default CaseReviewPage;
