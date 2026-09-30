import { redirect } from "next/navigation";

import { getQuizResult } from "../../../actions/quiz.action";
import ScoreDashboard from "../../../../components/ScoreDashboard";

export default async function QuizResultPage({ params }) {
  const { attemptId } = await params;

  if (!attemptId) {
    redirect("/");
  }

  try {
    const result = await getQuizResult({ attemptId });

    if (!result.success || !result.data) {
      redirect("/");
    }

    const { result: quizResult, userName } = result.data;

    return (
      <ScoreDashboard
        result={quizResult}
        userName={userName}
      />
    );
  } catch (error) {
    console.error("Quiz result page error:", error);
    redirect("/");
  }
}