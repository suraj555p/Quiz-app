"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Flag,
  LayoutList,
  Menu,
  Send,
  X,
} from "lucide-react";

export default function ToggleQuestionSidebar({
  questions = [],
  answers = {},
  markedQuestions = [],
  currentQuestion = 1,
  onQuestionClick,
  onSubmit,
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpenSidebar = () => {
      setIsOpen(true);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("open-question-sidebar", handleOpenSidebar);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener(
        "open-question-sidebar",
        handleOpenSidebar
      );
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const normalizedQuestions = useMemo(() => {
    return questions.map((question, index) => ({
      ...question,
      displayNumber: question.questionNumber || index + 1,
    }));
  }, [questions]);

  const isAnswered = (questionId) => {
    const answer = answers?.[questionId];

    return answer !== undefined && answer !== null && answer !== "";
  };

  const isMarked = (questionId) => {
    return markedQuestions.includes(questionId);
  };

  const attemptedCount = normalizedQuestions.filter((question) =>
    isAnswered(question.id)
  ).length;

  const markedCount = normalizedQuestions.filter((question) =>
    isMarked(question.id)
  ).length;

  const notAttemptedCount =
    normalizedQuestions.length - attemptedCount;

  const getQuestionStatus = (question) => {
    const answered = isAnswered(question.id);
    const marked = isMarked(question.id);

    if (answered && marked) {
      return "answeredMarked";
    }

    if (marked) {
      return "marked";
    }

    if (answered) {
      return "attempted";
    }

    return "notAttempted";
  };

  const getQuestionButtonClass = (question) => {
    const status = getQuestionStatus(question);
    const isCurrent = currentQuestion === question.displayNumber;

    const baseClass =
      "flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-extrabold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20";

    if (isCurrent) {
      return `${baseClass} border-indigo-700 bg-indigo-600 text-white ring-4 ring-indigo-600/20`;
    }

    if (status === "answeredMarked") {
      return `${baseClass} border-emerald-600 bg-emerald-500 text-white`;
    }

    if (status === "marked") {
      return `${baseClass} border-purple-500 bg-purple-500 text-white`;
    }

    if (status === "attempted") {
      return `${baseClass} border-emerald-600 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/60`;
    }

    return `${baseClass} border-red-200 bg-red-50 text-red-600 hover:border-red-300 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60`;
  };

  const handleQuestionClick = (question) => {
    onQuestionClick?.(question.displayNumber);
    setIsOpen(false);
  };

  const handleSubmit = () => {
    setIsOpen(false);
    onSubmit?.();
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open question palette"
        aria-expanded={isOpen}
        className="fixed left-4 top-[76px] z-30 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-lg transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 lg:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/40"
      >
        <Menu className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        Questions
      </button>

      {/* Mobile overlay: navbar के नीचे से शुरू होगा */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close question palette"
          onClick={() => setIsOpen(false)}
          className="fixed inset-x-0 bottom-0 top-16 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        aria-label="Question palette"
        className={`fixed left-0 top-16 z-40 flex h-[calc(100vh-64px)] w-[285px] flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 lg:top-[72px] lg:h-[calc(100vh-72px)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-5 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-indigo-600">
                <LayoutList className="h-4 w-4" />
              </div>

              Question Palette
            </div>

            <p className="mt-2 text-xs text-slate-400">
              {attemptedCount} of {normalizedQuestions.length} attempted
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close question palette"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 lg:hidden dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status summary */}
        <div className="grid shrink-0 grid-cols-2 gap-2 border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600/70 dark:text-emerald-400/70">
                  Attempted
                </p>

                <p className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">
                  {attemptedCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-red-100 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/30">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 rounded-full border-2 border-red-500 bg-red-100 dark:bg-red-950" />

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-red-600/70 dark:text-red-400/70">
                  Not Attempted
                </p>

                <p className="text-lg font-extrabold text-red-700 dark:text-red-300">
                  {notAttemptedCount}
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-2 rounded-xl border border-purple-100 bg-purple-50 p-3 dark:border-purple-900/50 dark:bg-purple-950/30">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-purple-600 dark:text-purple-400" />

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-purple-600/70 dark:text-purple-400/70">
                  Marked For Review
                </p>

                <p className="text-lg font-extrabold text-purple-700 dark:text-purple-300">
                  {markedCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Question numbers */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-wider text-slate-400">
            All Questions
          </p>

          {normalizedQuestions.length > 0 ? (
            <div className="grid grid-cols-5 gap-3">
              {normalizedQuestions.map((question) => {
                return (
                  <button
                    key={question.id}
                    type="button"
                    title={`Question ${question.displayNumber}`}
                    aria-label={`Go to question ${question.displayNumber}`}
                    aria-current={
                      currentQuestion === question.displayNumber
                        ? "step"
                        : undefined
                    }
                    onClick={() => handleQuestionClick(question)}
                    className={getQuestionButtonClass(question)}
                  >
                    {question.displayNumber}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center dark:border-slate-800 dark:bg-slate-800/60">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                No questions found
              </p>
            </div>
          )}

          {/* Legend */}
          <div className="mt-7 space-y-3 border-t border-slate-100 pt-5 dark:border-slate-800">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Status
            </p>

            <Legend
              color="border-emerald-600 bg-emerald-100 dark:bg-emerald-950/50"
              label="Attempted"
            />

            <Legend
              color="border-red-300 bg-red-50 dark:bg-red-950/30"
              label="Not Attempted"
            />

            <Legend
              color="border-purple-500 bg-purple-500"
              label="Marked For Review"
            />

            <Legend
              color="border-indigo-700 bg-indigo-600"
              label="Current Question"
            />
          </div>
        </div>

        {/* Submit button */}
        <div className="shrink-0 border-t border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-slate-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-indigo-600/20 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            <Send className="h-4 w-4" />
            Submit Test
          </button>
        </div>
      </aside>
    </>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
      <span className={`h-4 w-4 rounded border-2 ${color}`} />
      {label}
    </div>
  );
}