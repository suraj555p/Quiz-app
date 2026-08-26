"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteSubject } from "../app/actions/admin.action";
import toast from "react-hot-toast";

export default function DeleteSubjectButton({ subjectId }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(e) {
    // Fix: Link ke andar hai (ya upar), navigation ko rokna zaroori hai
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Kya aap sach me is subject ko delete karna chahte ho?")) {
      return;
    }

    startTransition(async () => {
      try {
        // id se delete karo, name se nahi (unique aur reliable)
        await deleteSubject({ id: subjectId });
        toast.success("Subject deleted successfully");
      } catch (error) {
        toast.error("Something went wrong while deleting the subject");
      }
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-500 shadow-sm hover:bg-red-50 disabled:opacity-50 dark:bg-slate-800 dark:hover:bg-red-950/40"
      aria-label="Delete subject"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}
