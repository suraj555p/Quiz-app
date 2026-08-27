"use client";

import { useEffect, useState } from "react";
import { getUsersResults, deleteUserResult } from "../app/actions/admin.action";

export default function AdminResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchResults = async () => {
    try {
      setLoading(true);

      const result = await getUsersResults();

      if (!result.success) {
        setError(result.message);
        return;
      }

      setResults(result.data);
    } catch (error) {
      console.error(error);
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleDelete = async (attemptId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quiz result?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(attemptId);

      const result = await deleteUserResult(attemptId);

      if (!result.success) {
        alert(result.message);
        return;
      }

      setResults((prevResults) =>
        prevResults.filter((item) => item.id !== attemptId)
      );

    } catch (error) {
      console.error(error);
      alert("Something went wrong while deleting the result!");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center text-red-600">
        {error}
      </div>
    );
  }

 return (
  <div className="w-full">

    {/* ================= DESKTOP TABLE ================= */}
    <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            User Results
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Monitor all quiz attempts and user performance
          </p>
        </div>

        <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-600">
          Total Attempts: {results.length}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1150px] text-left">

          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                User
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Subject
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Score
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Correct
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Wrong
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Skipped
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Date
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Action
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">

            {results.length > 0 ? (
              results.map((result) => (
                <tr
                  key={result.id}
                  className="transition-colors duration-200 hover:bg-gray-50"
                >

                  {/* User */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">

                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-indigo-100">

                        {result.user?.profile ? (
                          <img
                            src={result.user.profile}
                            alt={result.user?.username || "User"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-indigo-600">
                            {result.user?.username
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </div>
                        )}

                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900">
                          {result.user?.username || "Unknown User"}
                        </p>

                        <p className="truncate text-xs text-gray-500">
                          {result.user?.email || "No email"}
                        </p>
                      </div>

                    </div>
                  </td>

                  {/* Subject */}
                  <td className="px-6 py-5">
                    <span className="inline-flex rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
                      {result.subject?.subjectName || "Unknown"}
                    </span>
                  </td>

                  {/* Score */}
                  <td className="px-6 py-5">
                    <span className="font-bold text-gray-900">
                      {result.score}
                    </span>

                    <span className="ml-1 text-xs text-gray-400">
                      / {result.totalMarks}
                    </span>
                  </td>

                  {/* Correct */}
                  <td className="px-6 py-5">
                    <span className="inline-flex min-w-[38px] justify-center rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-600">
                      {result.correctAnswers}
                    </span>
                  </td>

                  {/* Wrong */}
                  <td className="px-6 py-5">
                    <span className="inline-flex min-w-[38px] justify-center rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
                      {result.wrongAnswers}
                    </span>
                  </td>

                  {/* Skipped */}
                  <td className="px-6 py-5">
                    <span className="inline-flex min-w-[38px] justify-center rounded-full bg-yellow-50 px-3 py-1 text-sm font-semibold text-yellow-600">
                      {result.skippedAnswers}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-5 text-sm text-gray-500">
                    {new Date(result.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </td>

                  {/* Delete */}
                  <td className="px-6 py-5">
                    <button
                      onClick={() => handleDelete(result.id)}
                      disabled={deletingId === result.id}
                      className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === result.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="px-6 py-16 text-center"
                >
                  <div className="text-4xl">📊</div>

                  <h3 className="mt-4 font-semibold text-gray-900">
                    No Results Found
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    No quiz attempts are available yet.
                  </p>
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>


    {/* ================= MOBILE ================= */}
    <div className="block md:hidden">

      {/* Mobile Header */}
      <div className="mb-4 flex items-center justify-between">

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            User Results
          </h2>

          <p className="text-xs text-gray-500">
            Quiz attempts & performance
          </p>
        </div>

        <div className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-600">
          {results.length} Attempts
        </div>

      </div>


      {/* Mobile Cards */}
      {results.length > 0 ? (
        <div className="space-y-4">

          {results.map((result) => (
            <div
              key={result.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >

              {/* User Section */}
              <div className="flex items-center justify-between border-b border-gray-100 p-4">

                <div className="flex min-w-0 items-center gap-3">

                  {/* Profile */}
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-indigo-100">

                    {result.user?.profile ? (
                      <img
                        src={result.user.profile}
                        alt={result.user?.username || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-bold text-indigo-600">
                        {result.user?.username
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </div>
                    )}

                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-bold text-gray-900">
                      {result.user?.username || "Unknown User"}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {result.user?.email || "No email"}
                    </p>

                  </div>

                </div>

                {/* Score */}
                <div className="ml-3 shrink-0 text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {result.score}
                  </p>

                  <p className="text-[11px] text-gray-400">
                    / {result.totalMarks}
                  </p>
                </div>

              </div>


              {/* Subject */}
              <div className="px-4 pt-4">

                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                  Subject
                </p>

                <span className="inline-flex rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700">
                  {result.subject?.subjectName || "Unknown"}
                </span>

              </div>


              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 p-4">

                {/* Correct */}
                <div className="rounded-xl bg-green-50 p-3 text-center">
                  <p className="text-lg font-bold text-green-600">
                    {result.correctAnswers}
                  </p>

                  <p className="text-[11px] font-medium text-green-600">
                    Correct
                  </p>
                </div>


                {/* Wrong */}
                <div className="rounded-xl bg-red-50 p-3 text-center">
                  <p className="text-lg font-bold text-red-600">
                    {result.wrongAnswers}
                  </p>

                  <p className="text-[11px] font-medium text-red-600">
                    Wrong
                  </p>
                </div>


                {/* Skipped */}
                <div className="rounded-xl bg-yellow-50 p-3 text-center">
                  <p className="text-lg font-bold text-yellow-600">
                    {result.skippedAnswers}
                  </p>

                  <p className="text-[11px] font-medium text-yellow-600">
                    Skipped
                  </p>
                </div>

              </div>


              {/* Footer */}
              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-3">

                <div>
                  <p className="text-[11px] text-gray-400">
                    Attempted on
                  </p>

                  <p className="text-xs font-medium text-gray-600">
                    {new Date(result.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>


                {/* Delete */}
                <button
                  onClick={() => handleDelete(result.id)}
                  disabled={deletingId === result.id}
                  className="rounded-lg bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition active:scale-95 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingId === result.id
                    ? "Deleting..."
                    : "Delete"}
                </button>

              </div>

            </div>
          ))}

        </div>
      ) : (

        /* Mobile Empty State */
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
            📊
          </div>

          <h3 className="mt-4 font-semibold text-gray-900">
            No Results Found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            No quiz attempts are available yet.
          </p>

        </div>

      )}

    </div>

  </div>
);
}