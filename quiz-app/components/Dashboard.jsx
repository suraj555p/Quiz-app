
import { getSubject} from "../app/actions/admin.action";
import SubjectCard from "./SubjectCart";
import { BookOpen, Sparkles } from "lucide-react";

export default async function Dashboard() {
  const result = await getSubject();
  const subjects = result.success ? result.data : [];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Background / Header */}
        <section className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-8">
          {/* Decorative gradient */}
          <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-indigo-100/60 blur-3xl dark:bg-indigo-950/30" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-purple-100/50 blur-3xl dark:bg-purple-950/20" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Heading */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <BookOpen className="h-4 w-4" />
                </span>

                <span className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
                  Quiz Library
                </span>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Your Subjects
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Explore your available subjects and start a quiz whenever
                you're ready.
              </p>
            </div>

            {/* Subject Count */}
            <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/20">
                <Sparkles className="h-4 w-4" />
              </div>

              <div>
                <p className="text-2xl font-extrabold leading-none text-slate-900 dark:text-white">
                  {subjects.length}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  {subjects.length === 1 ? "Subject" : "Subjects"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Header */}
        {result.success && subjects.length > 0 && (
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Available Quizzes
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Choose a subject to begin
              </p>
            </div>

            <div className="hidden h-px flex-1 bg-slate-200 dark:bg-slate-800 sm:ml-6 sm:block" />
          </div>
        )}

        {/* Content */}
        {!result.success || subjects.length === 0 ? (
          <div className="relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center dark:border-slate-700 dark:bg-slate-900">
            {/* Decorative circles */}
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-50 blur-3xl dark:bg-indigo-950/20" />

            <div className="relative">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                <BookOpen className="h-7 w-7" />
              </div>

              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                No subjects available
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {result.message ||
                  "There are currently no subjects available. Please check back later."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}