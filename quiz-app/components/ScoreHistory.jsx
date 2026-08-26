import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Trophy,
  XCircle,
} from "lucide-react";

export default function ScoreHistory({
  attempts = [],
  userName = "Student",
}) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Page header */}
        <section className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-indigo-600" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <Trophy className="h-3.5 w-3.5" />
                Performance
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Welcome, {userName}
              </h1>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Check your previous quiz attempts and scores.
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm dark:bg-indigo-600">
              <Trophy className="h-7 w-7" />
            </div>
          </div>
        </section>

        {/* Empty state */}
        {attempts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FileCheck2 className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />

            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              No quiz attempts yet
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Attempt a quiz to see your score here.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              Explore Quizzes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <section className="grid gap-5">
            {attempts.map((attempt) => {
              const percentage =
                attempt.totalMarks > 0
                  ? Math.max(
                      0,
                      Math.round(
                        (attempt.score / attempt.totalMarks) * 100
                      )
                    )
                  : 0;

              return (
                <article
                  key={attempt.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                          <FileCheck2 className="h-5 w-5" />
                        </div>

                        <div>
                          <h2 className="font-extrabold text-slate-900 dark:text-white">
                            {attempt.subject?.subjectName || "Quiz"}
                          </h2>

                          <p className="mt-1 text-xs text-slate-400">
                            {formatDate(attempt.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                          {attempt.score}
                          <span className="text-sm text-slate-400">
                            {" "}
                            / {attempt.totalMarks}
                          </span>
                        </p>

                        <p className="text-xs font-bold text-slate-400">
                          {percentage}% score
                        </p>
                      </div>

                      <Link
                        href={`/quiz/result/${attempt.id}`}
                        aria-label="View detailed result"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-300"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                    <MiniStat
                      icon={<CheckCircle2 className="h-4 w-4" />}
                      label="Correct"
                      value={attempt.correctAnswers}
                      color="emerald"
                    />

                    <MiniStat
                      icon={<XCircle className="h-4 w-4" />}
                      label="Wrong"
                      value={attempt.wrongAnswers}
                      color="red"
                    />

                    <MiniStat
                      icon={<Clock3 className="h-4 w-4" />}
                      label="Skipped"
                      value={attempt.skippedAnswers}
                      color="amber"
                    />
                  </div>

                  <Link
                    href={`/quiz/result/${attempt.id}`}
                    className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-300"
                  >
                    View Full Result
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

function MiniStat({ icon, label, value, color }) {
  const colorClasses = {
    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
    red:
      "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${colorClasses[color]}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
          {value}
        </p>
      </div>
    </div>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}