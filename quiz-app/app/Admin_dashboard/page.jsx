"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  BookOpen,
  Clock,
  ListChecks,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Save,
  Sparkles,
} from "lucide-react";
import { createSubject } from "../actions/admin.action";

const emptyQuestion = {
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  correctOption: "1",
};

const emptySubject = {
  subjectName: "",
  time: "",
  numberOfquestions: "",
  positiveMarking: "",
  negativeMarking: "",
};

function AdminDashboard() {
  const [subjectData, setSubjectData] = useState(emptySubject);
  const [currentQuestion, setCurrentQuestion] = useState(emptyQuestion);
  const [questionsList, setQuestionsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubjectChange = (e) => {
    const { name, value } = e.target;

    setSubjectData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;

    setCurrentQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddQuestion = () => {
    const {
      question,
      option1,
      option2,
      option3,
      option4,
      correctOption,
    } = currentQuestion;

  const correctOptNum = parseInt(correctOption);

  if (
    !question?.trim() ||
    !option1?.trim() ||
    !option2?.trim() ||
    !option3?.trim() ||
    !option4?.trim() ||
    !correctOption ||
    isNaN(correctOptNum) ||
    correctOptNum < 1 ||
    correctOptNum > 4
  ) {
    toast.error("Fill in all question fields correctly");
    return;
  }

    setQuestionsList((prev) => [
      ...prev,
      {
        ...currentQuestion,
        questionNumber: prev.length + 1,
        correctOption: correctOptNum, 
      },
    ]);

    setCurrentQuestion(emptyQuestion);

    toast.success("Question added");
  };

  const handleRemoveQuestion = (index) => {
    setQuestionsList((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((q, i) => ({
          ...q,
          questionNumber: i + 1,
        }))
    );
  };

  const handleSubmit = async () => {
    if (
      !subjectData.subjectName ||
      !subjectData.time ||
      !subjectData.numberOfquestions
    ) {
      toast.error("Please fill in all subject details");
      return;
    }

    if (questionsList.length === 0) {
      toast.error("Add at least one question");
      return;
    }

    setLoading(true);

    try {
      const result = await createSubject(subjectData, questionsList);

      if (result.success) {
        toast.success("Paper saved successfully");

        setSubjectData(emptySubject);
        setQuestionsList([]);
        setCurrentQuestion(emptyQuestion);
      } else {
        toast.error(
          result.message || "Something went wrong, please try again"
        );
      }
    } catch (err) {
      console.log("submit error", err);

      toast.error("Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500";

  const labelClass =
    "text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400";

  const questionsCount = questionsList.length;
  const totalQuestions = Number(subjectData.numberOfquestions) || 0;

  const progress =
    totalQuestions > 0
      ? Math.min((questionsCount / totalQuestions) * 100, 100)
      : 0;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-indigo-100/60 blur-3xl dark:bg-indigo-950/30" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <Sparkles className="h-4 w-4" />
                </span>

                <span className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
                  Admin Studio
                </span>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Create Quiz Paper
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Create a subject, configure marking rules, and add questions
                to build your quiz.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/20">
                <ListChecks className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xl font-extrabold leading-none text-slate-900 dark:text-white">
                  {questionsCount}
                  {totalQuestions > 0 && (
                    <span className="text-sm font-semibold text-slate-400">
                      {" "}
                      / {totalQuestions}
                    </span>
                  )}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Questions
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                    <BookOpen className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white">
                      Paper Details
                    </h2>

                    <p className="text-xs text-slate-400">
                      Configure your quiz
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <label className={labelClass}>Subject Name</label>

                  <input
                    name="subjectName"
                    value={subjectData.subjectName}
                    onChange={handleSubjectChange}
                    placeholder="e.g. Data Structures"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Time (Minutes)</label>

                  <div className="relative">
                    <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      name="time"
                      type="number"
                      min="1"
                      value={subjectData.time}
                      onChange={handleSubjectChange}
                      placeholder="30"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Number of Questions</label>

                  <div className="relative">
                    <ListChecks className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      name="numberOfquestions"
                      type="number"
                      min="1"
                      value={subjectData.numberOfquestions}
                      onChange={handleSubjectChange}
                      placeholder="20"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Positive</label>

                    <div className="relative">
                      <CheckCircle2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />

                      <input
                        name="positiveMarking"
                        type="number"
                        min="0"
                        value={subjectData.positiveMarking}
                        onChange={handleSubjectChange}
                        placeholder="1"
                        className={`${inputClass} pl-9`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Negative</label>

                    <div className="relative">
                      <XCircle className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />

                      <input
                        name="negativeMarking"
                        type="number"
                        min="0"
                        value={subjectData.negativeMarking}
                        onChange={handleSubjectChange}
                        placeholder="0.25"
                        className={`${inputClass} pl-9`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 px-5 py-5 dark:border-slate-800">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Questions added
                  </span>

                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {questionsCount}
                    {totalQuestions > 0 && ` / ${totalQuestions}`}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {totalQuestions > 0 && questionsCount > totalQuestions && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    You have added more questions than required.
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white shadow-md shadow-slate-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  <Save className="h-4 w-4" />

                  {loading ? "Saving Paper..." : "Save Paper"}
                </button>
              </div>
            </div>
          </aside>

          <section className="space-y-5">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/20">
                    <Plus className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white">
                      Add a Question
                    </h2>

                    <p className="text-xs text-slate-400">
                      Create a multiple-choice question
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div>
                  <label className={labelClass}>Question</label>

                  <textarea
                    name="question"
                    value={currentQuestion.question}
                    onChange={handleQuestionChange}
                    placeholder="Type your question here..."
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="mt-5">
                  <label className={labelClass}>Answer Options</label>

                  <div className="mt-1.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {["option1", "option2", "option3", "option4"].map(
                      (optKey, i) => (
                        <div key={optKey} className="relative">
                          <span className="absolute left-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md bg-slate-100 text-[11px] font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                            {String.fromCharCode(65 + i)}
                          </span>

                          <input
                            name={optKey}
                            value={currentQuestion[optKey]}
                            onChange={handleQuestionChange}
                            placeholder={`Option ${i + 1}`}
                            className={`${inputClass} pl-12`}
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:items-end">
                  <div className="sm:w-56">
                    <label className={labelClass}>Correct Option</label>

                    <select
                      name="correctOption"
                      value={currentQuestion.correctOption || "1"}
                      onChange={handleQuestionChange}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="">Select correct answer</option>
                      <option value="1">Option 1</option>
                      <option value="2">Option 2</option>
                      <option value="3">Option 3</option>
                      <option value="4">Option 4</option>
                    </select>
                  </div>

                  <button
                    onClick={handleAddQuestion}
                    className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/25"
                  >
                    <Plus className="h-4 w-4" />
                    Add Question
                  </button>
                </div>
              </div>
            </div>

            {questionsList.length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                  <ListChecks className="h-6 w-6" />
                </div>

                <h3 className="font-bold text-slate-700 dark:text-slate-200">
                  No questions yet
                </h3>

                <p className="mt-1 max-w-sm text-sm text-slate-400">
                  Add your first question using the form above. Your questions
                  will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Questions
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      {questionsList.length} question
                      {questionsList.length !== 1 ? "s" : ""} added
                    </p>
                  </div>
                </div>

                {questionsList.map((q, index) => (
                  <div
                    key={index}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                        Q{q.questionNumber}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-100">
                          {q.question}
                        </p>

                        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {[q.option1, q.option2, q.option3, q.option4].map(
                            (option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className={`rounded-lg border px-3 py-2 text-xs ${
                                  String(optionIndex + 1) ===
                                  String(q.correctOption)
                                    ? "border-emerald-200 bg-emerald-50 font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"
                                    : "border-slate-100 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-400"
                                }`}
                              >
                                <span className="mr-2 font-bold">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>

                                {option}
                              </div>
                            )
                          )}
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />

                          <span className="text-slate-400">
                            Correct answer:
                          </span>

                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            Option {q.correctOption}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveQuestion(index)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                        title="Remove question"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;