import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CircleX,
  FileCheck2,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";

export default function ScoreDashboard({
  result,
  userName = "Student",
}) {
  const {
    score,
    totalMarks,
    correctAnswers,
    wrongAnswers,
    skippedAnswers,
    answers = [],
  } = result;

  const percentage =
    totalMarks > 0
      ? Math.max(0, Math.round((score / totalMarks) * 100))
      : 0;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Subjects
        </Link>

        {/* Score header */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-indigo-600" />

          <div className="relative flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                <Trophy className="h-3.5 w-3.5" />
                Test Completed
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Well done, {userName}!
              </h1>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Here is your complete quiz performance report.
              </p>
            </div>

            <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border-8 border-indigo-100 bg-indigo-50 dark:border-indigo-950/50 dark:bg-indigo-950/30">
              <p className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300">
                {score}
              </p>

              <p className="text-xs font-bold text-slate-400">
                out of {totalMarks}
              </p>

              <p className="mt-1 text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                {percentage}%
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<FileCheck2 className="h-5 w-5" />}
            label="Total Questions"
            value={correctAnswers + wrongAnswers + skippedAnswers}
            color="indigo"
          />

          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Correct Answers"
            value={correctAnswers}
            color="emerald"
          />

          <StatCard
            icon={<CircleX className="h-5 w-5" />}
            label="Wrong Answers"
            value={wrongAnswers}
            color="red"
          />

          <StatCard
            icon={<RotateCcw className="h-5 w-5" />}
            label="Skipped Answers"
            value={skippedAnswers}
            color="amber"
          />
        </section>

        {/* Question-wise result */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 p-5 dark:border-slate-800">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Question-wise Performance
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Check your answer status for every question.
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {answers.map((answer, index) => {
              const status = answer.isSkipped
                ? "Skipped"
                : answer.isCorrect
                  ? "Correct"
                  : "Wrong";

              return (
                <div
                  key={answer.id || answer.questionId}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold ${
                        answer.isSkipped
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                          : answer.isCorrect
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                      }`}
                    >
                      {answer.questionNumber || index + 1}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        Question {answer.questionNumber || index + 1}
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Your answer:{" "}
                        {answer.selectedOption
                          ? `Option ${answer.selectedOption}`
                          : "Not attempted"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${
                        answer.isSkipped
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                          : answer.isCorrect
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                      }`}
                    >
                      {status}
                    </span>

                    {!answer.isSkipped && (
                      <span className="text-xs font-semibold text-slate-400">
                        Correct: Option {answer.correctOption}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ icon, label, value, color }) {
  const colorClasses = {
    indigo:
      "border-indigo-100 bg-indigo-50 text-indigo-600 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-400",
    emerald:
      "border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400",
    red:
      "border-red-100 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400",
    amber:
      "border-amber-100 bg-amber-50 text-amber-600 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl border ${colorClasses[color]}`}
      >
        {icon}
      </div>

      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}