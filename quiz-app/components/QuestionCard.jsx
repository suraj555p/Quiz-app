"use client";

import {
  Bookmark,
  Check,
  Circle,
  Flag,
  RotateCcw,
} from "lucide-react";

export default function QuestionCard({
  question,
  index,
  selectedOption,
  isMarked,
  onAnswerChange,
  onToggleMark,
  onClearResponse,
}) {
  const options = [
    {
      number: 1,
      text: question.option1,
    },
    {
      number: 2,
      text: question.option2,
    },
    {
      number: 3,
      text: question.option3,
    },
    {
      number: 4,
      text: question.option4,
    },
  ];

  return (
    <article
      id={`question-${question.id}`}
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 dark:hover:shadow-black/20"
    >
      <div className="h-1 bg-indigo-600" />

      <div className="p-5 sm:p-7">
        {/* Question header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-extrabold text-white dark:bg-indigo-600">
              {question.questionNumber || index + 1}
            </div>

            <div>
              <p className="mb-1.5 text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Question {question.questionNumber || index + 1}
              </p>

              <h2 className="text-base font-bold leading-7 text-slate-900 dark:text-white sm:text-lg">
                {question.question}
              </h2>
            </div>
          </div>

          {isMarked && (
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
              <Flag className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Review</span>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const isSelected = selectedOption === option.number;

            return (
              <button
                key={option.number}
                type="button"
                onClick={() => onAnswerChange(question.id, option.number)}
                aria-pressed={isSelected}
                className={`group flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50 ring-4 ring-indigo-500/10 dark:border-indigo-500 dark:bg-indigo-950/40"
                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/20"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-extrabold transition ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-300 bg-slate-50 text-slate-500 group-hover:border-indigo-400 group-hover:text-indigo-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {isSelected ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    String.fromCharCode(64 + option.number)
                  )}
                </span>

                <span
                  className={`pt-0.5 text-sm font-semibold leading-6 ${
                    isSelected
                      ? "text-indigo-800 dark:text-indigo-200"
                      : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Question actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Circle className="h-3.5 w-3.5" />

            {selectedOption ? "Answer selected" : "Not attempted"}
          </div>

          <div className="flex items-center gap-2">
            {selectedOption && (
              <button
                type="button"
                onClick={() => onClearResponse(question.id)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear Response
              </button>
            )}

            <button
              type="button"
              onClick={() => onToggleMark(question.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
                isMarked
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-950/50 dark:text-purple-300"
                  : "text-slate-500 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-950/30 dark:hover:text-purple-300"
              }`}
            >
              <Bookmark
                className={`h-3.5 w-3.5 ${
                  isMarked ? "fill-current" : ""
                }`}
              />

              {isMarked ? "Unmark Review" : "Mark for Review"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}