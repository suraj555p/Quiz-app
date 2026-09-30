
import Link from "next/link";
import {
  Clock,
  ListChecks,
  CheckCircle2,
  XCircle,
  CalendarDays,
  ArrowRight,
  Trash2,
} from "lucide-react";
import { dbUser } from "../app/actions/user.action";
import { deleteSubject } from "../app/actions/admin.action";
import toast from "react-hot-toast";
import DeleteSubjectButton from "./DeleteSubjectButton";

export default async function SubjectCard({ subject }) {
   const getUser = await dbUser();
   const isAdmin = Boolean( getUser?.email && process.env.ADMIN_EMAIL && getUser.email === process.env.ADMIN_EMAIL);
  const {
    id,
    subjectName,
    time,
    numberOfquestions,
    positiveMarking,
    negativeMarking,
    createdAt,
  } = subject;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="group relative w-full">
    <Link
      href={`/subjects/${id}`}
      className="group relative block w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 dark:hover:shadow-black/20"
    >
      <div className="absolute inset-x-0 top-0 h-0.5 bg-indigo-600 opacity-70 transition-all duration-300 group-hover:h-1 group-hover:opacity-100" />

      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
            Quiz Subject
          </p>

          <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-slate-900 dark:text-white">
            {subjectName}
          </h3>
        </div>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 group-hover:border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:border-indigo-600 dark:group-hover:bg-indigo-600">
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 transition-colors group-hover:border-slate-200 dark:border-slate-800 dark:bg-slate-800/70 dark:group-hover:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm dark:bg-slate-700 dark:text-slate-300">
              <Clock className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Duration
              </p>
              <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-100">
                {time} min
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 transition-colors group-hover:border-slate-200 dark:border-slate-800 dark:bg-slate-800/70 dark:group-hover:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm dark:bg-slate-700 dark:text-slate-300">
              <ListChecks className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Questions
              </p>
              <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-100">
                {numberOfquestions}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm dark:bg-emerald-950 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-600/70 dark:text-emerald-400/70">
                Correct
              </p>
              <p className="mt-0.5 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                +{positiveMarking}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-red-100 bg-red-50/70 p-3 dark:border-red-900/50 dark:bg-red-950/30">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-red-600 shadow-sm dark:bg-red-950 dark:text-red-400">
              <XCircle className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-red-600/70 dark:text-red-400/70">
                Negative
              </p>
              <p className="mt-0.5 text-sm font-bold text-red-700 dark:text-red-300">
                -{negativeMarking}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>{formattedDate}</span>
        </div>

        <span className="translate-x-1 text-xs font-semibold text-indigo-600 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 dark:text-indigo-400">
          Start Quiz →
        </span>
      </div>
    </Link>
       {isAdmin && (
        <div className="absolute right-3 top-3 z-10">
          <DeleteSubjectButton subjectId={id} />
        </div>
      )}
    </div>
  );
}