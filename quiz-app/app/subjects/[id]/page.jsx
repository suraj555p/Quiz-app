import { notFound } from "next/navigation";

import { getQuiz } from "../../actions/quiz.action";
import QuizAttempt from "../../../components/QuizAttempt";

export default async function QuestionsPage({ params }) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const result = await getQuiz({ id });

  if (!result.success || !result.data) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm dark:border-red-900/40 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <span className="text-2xl font-bold">!</span>
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
            Quiz unavailable
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {result.message || "Unable to load this quiz."}
          </p>
        </div>
      </main>
    );
  }

  const {
    subject,
    questions = [],
  } = result.data;

  if (!subject) {
    notFound();
  }

  const durationInMinutes = Number(subject.time);
  console.log(durationInMinutes);

  if (!Number.isFinite(durationInMinutes) || durationInMinutes <= 0) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-amber-100 bg-white p-8 text-center shadow-sm dark:border-amber-900/40 dark:bg-slate-900">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Invalid quiz duration
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            This quiz does not have a valid time limit.
          </p>
        </div>
      </main>
    );
  }

  return (
    <QuizAttempt
      questions={questions}
      subjectId={subject.id}
      durationInMinutes={durationInMinutes}
    />
  );
}