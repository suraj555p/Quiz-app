"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  ListChecks,
  ShieldCheck,
} from "lucide-react";

import { submitQuiz } from "../app/actions/quiz.action";
import QuestionCard from "./QuestionCard";
import ToggleQuestionSidebar from "./ToggleQuestionSidebar";

export default function QuizAttempt({
  questions = [],
  subjectId,
  durationInMinutes = 30,
}) {
  const router = useRouter();

  const normalizedQuestions = useMemo(() => {
    return questions.map((question, index) => ({
      ...question,
      displayNumber: question.questionNumber || index + 1,
    }));
  }, [questions]);

  const [answers, setAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [remainingSeconds, setRemainingSeconds] = useState(null);

  const hasAutoSubmitted = useRef(false);

  const timerStorageKey = subjectId
    ? `quiz-end-time-${subjectId}`
    : null;

  const currentQuestion = normalizedQuestions[currentIndex];

  const currentQuestionNumber =
    currentQuestion?.displayNumber || currentIndex + 1;

  const isLastQuestion =
    currentIndex === normalizedQuestions.length - 1;

  const isLastMinute =
    remainingSeconds !== null &&
    remainingSeconds > 0 &&
    remainingSeconds <= 60;

  const formatTime = (totalSeconds) => {
    const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    return `${String(minutes).padStart(2, "0")} : ${String(
      seconds
    ).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!timerStorageKey) return;

    const durationInSeconds = Math.max(
      0,
      Number(durationInMinutes) * 60
    );

    if (durationInSeconds <= 0) {
      setRemainingSeconds(0);
      return;
    }

    const existingEndTime = sessionStorage.getItem(
      timerStorageKey
    );

    if (existingEndTime) {
      const secondsLeft = Math.max(
        0,
        Math.ceil(
          (Number(existingEndTime) - Date.now()) / 1000
        )
      );

      setRemainingSeconds(secondsLeft);
      return;
    }

    const newEndTime =
      Date.now() + durationInSeconds * 1000;

    sessionStorage.setItem(
      timerStorageKey,
      String(newEndTime)
    );

    setRemainingSeconds(durationInSeconds);
  }, [
    durationInMinutes,
    timerStorageKey,
  ]);

  useEffect(() => {
    if (!timerStorageKey) return;
    if (isSubmitting) return;

    const storedEndTime = sessionStorage.getItem(
      timerStorageKey
    );

    if (!storedEndTime) return;

    const endTime = Number(storedEndTime);

    const updateTimer = () => {
      const secondsLeft = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
      );

      setRemainingSeconds(secondsLeft);
    };

    updateTimer();

    const timerId = window.setInterval(updateTimer, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [
    isSubmitting,
    timerStorageKey,
  ]);

  useEffect(() => {
    if (normalizedQuestions.length === 0) return;

    if (currentIndex > normalizedQuestions.length - 1) {
      setCurrentIndex(normalizedQuestions.length - 1);
    }
  }, [
    currentIndex,
    normalizedQuestions.length,
  ]);

  const handleAnswerChange = (questionId, optionNumber) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: optionNumber,
    }));
  };

  const handleClearResponse = (questionId) => {
    setAnswers((previousAnswers) => {
      const updatedAnswers = { ...previousAnswers };

      delete updatedAnswers[questionId];

      return updatedAnswers;
    });
  };

  const handleToggleMark = (questionId) => {
    setMarkedQuestions((previousMarked) => {
      if (previousMarked.includes(questionId)) {
        return previousMarked.filter((id) => id !== questionId);
      }

      return [...previousMarked, questionId];
    });
  };

  const handleQuestionClick = (questionNumber) => {
    const selectedIndex = normalizedQuestions.findIndex(
      (question) => question.displayNumber === questionNumber
    );

    if (selectedIndex !== -1) {
      setCurrentIndex(selectedIndex);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((previousIndex) =>
      Math.max(previousIndex - 1, 0)
    );
  };

  const handleNext = () => {
    setCurrentIndex((previousIndex) =>
      Math.min(
        previousIndex + 1,
        normalizedQuestions.length - 1
      )
    );
  };

  const handleSubmit = useCallback(
    async ({ isAutoSubmit = false } = {}) => {
      if (isSubmitting) return;

      if (!subjectId) {
        alert("Subject ID is missing.");
        return;
      }

      if (normalizedQuestions.length === 0) {
        alert("No questions available.");
        return;
      }

      const unansweredQuestions = normalizedQuestions.filter(
        (question) =>
          answers[question.id] === undefined ||
          answers[question.id] === null
      );

      const attemptedCount =
        normalizedQuestions.length - unansweredQuestions.length;

      if (!isAutoSubmit) {
        const shouldSubmit = window.confirm(
          `You attempted ${attemptedCount} out of ${normalizedQuestions.length} questions. Do you want to submit the test?`
        );

        if (!shouldSubmit) return;
      }

      const submissionData = normalizedQuestions.map((question) => ({
        questionId: question.id,
        selectedOption: answers[question.id] ?? null,
        markedForReview: markedQuestions.includes(question.id),
      }));

      try {
        setIsSubmitting(true);

        const result = await submitQuiz({
          subjectId,
          answers: submissionData,
        });

        if (!result.success) {
          alert(
            result.message || "Unable to submit quiz."
          );
          return;
        }

        if (timerStorageKey) {
          sessionStorage.removeItem(timerStorageKey);
        }

        router.replace(
          `/quiz/result/${result.attemptId}`
        );
      } catch (error) {
        console.error("Quiz submit error:", error);

        alert(
          "Something went wrong while submitting the test."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      answers,
      isSubmitting,
      markedQuestions,
      normalizedQuestions,
      router,
      subjectId,
      timerStorageKey,
    ]
  );

  useEffect(() => {
    if (remainingSeconds === null) return;
    if (remainingSeconds !== 0) return;
    if (isSubmitting) return;
    if (hasAutoSubmitted.current) return;
    if (normalizedQuestions.length === 0) return;
    if (!timerStorageKey) return;

    hasAutoSubmitted.current = true;

    handleSubmit({
      isAutoSubmit: true,
    });
  }, [
    handleSubmit,
    isSubmitting,
    normalizedQuestions.length,
    remainingSeconds,
    timerStorageKey,
  ]);

  if (normalizedQuestions.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl lg:ml-[320px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <ListChecks className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />

            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              No questions available
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              This subject does not have any questions yet.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <ToggleQuestionSidebar
        questions={normalizedQuestions}
        answers={answers}
        markedQuestions={markedQuestions}
        currentQuestion={currentQuestionNumber}
        onQuestionClick={handleQuestionClick}
        onSubmit={() => handleSubmit()}
      />

      <div className="mx-auto max-w-4xl lg:ml-[320px] lg:max-w-4xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Subjects
          </Link>

          <div
            role="timer"
            aria-live="polite"
            className={`inline-flex w-fit items-center justify-center rounded-full border px-5 py-2.5 text-sm font-extrabold tabular-nums shadow-sm transition-all ${
              isLastMinute
                ? "animate-pulse border-red-200 bg-red-50 text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400"
                : "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300"
            }`}
          >
            <Clock3 className="mr-2 h-4 w-4" />

            {remainingSeconds === null
              ? "-- : --"
              : formatTime(remainingSeconds)}
          </div>
        </div>

        <section className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-indigo-600" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <BookOpenCheck className="h-3.5 w-3.5" />
                Quiz Practice
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Test Your Knowledge
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Select an answer or mark a question for review.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/70">
              <ListChecks className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Progress
                </p>

                <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {currentIndex + 1} / {normalizedQuestions.length}
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-6 grid gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Choose one answer
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Clock3 className="h-4 w-4 text-indigo-500" />
              Think before answering
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <ShieldCheck className="h-4 w-4 text-slate-500" />
              Submit when finished
            </div>
          </div>
        </section>

        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-400">
            <span>
              Question {currentQuestionNumber} of{" "}
              {normalizedQuestions.length}
            </span>

            <span>
              {Math.round(
                ((currentIndex + 1) / normalizedQuestions.length) * 100
              )}
              %
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
              style={{
                width: `${
                  ((currentIndex + 1) /
                    normalizedQuestions.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        <section className="space-y-5">
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            index={currentIndex}
            selectedOption={answers[currentQuestion.id] ?? null}
            isMarked={markedQuestions.includes(currentQuestion.id)}
            onAnswerChange={handleAnswerChange}
            onToggleMark={handleToggleMark}
            onClearResponse={handleClearResponse}
          />

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentIndex === 0 || isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/30"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            <span className="hidden text-xs font-bold text-slate-400 sm:block">
              {currentIndex + 1} / {normalizedQuestions.length}
            </span>

            {isLastQuestion ? (
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-extrabold text-white shadow-md shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit Test"}

                <CheckCircle2 className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-extrabold text-white shadow-md shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-500"
              >
                Next

                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}