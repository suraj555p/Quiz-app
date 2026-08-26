import { redirect } from "next/navigation";

import { dbUser } from "../actions/user.action";
import { getUserAttempts } from "../actions/quiz.action";
import ScoreHistory from "../../components/ScoreHistory";

export default async function ScoresPage() {
  const user = await dbUser();

  if (!user) {
    redirect("/");
  }

  const result = await getUserAttempts();

  if (!result.success) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm dark:border-red-900/40 dark:bg-slate-900">
          <h1 className="text-xl font-bold text-red-600 dark:text-red-400">
            Unable to load scores
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {result.message || "Something went wrong."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <ScoreHistory
      attempts={result.data ?? []}
      userName={
        user.username ||
        user.email?.split("@")[0] ||
        "Student"
      }
    />
  );
}