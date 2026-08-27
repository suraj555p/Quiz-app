"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Home, Menu, ShieldCheck, Trophy, X } from "lucide-react";

export default function MobileNavMenu({ isAdmin }) {
  const [isOpen, setIsOpen] = useState(false);

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

  const handleToggle = () => {
    setIsOpen((previousValue) => !previousValue);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative sm:hidden">
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        Menu
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={handleClose}
          className="fixed inset-x-0 bottom-0 top-16 z-40 bg-slate-950/20"
        />
      )}

      <div
        className={`absolute right-0 top-[calc(100%+8px)] z-50 w-56 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-xl transition-all duration-200 ${
          isOpen
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <Link
          href="/"
          onClick={handleClose}
          className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
        >
          <Home className="h-4 w-4" />
          Home
        </Link>

        <Link
          href="/scores"
          onClick={handleClose}
          className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
        >
          <Trophy className="h-4 w-4 text-amber-500" />
          My Scores
        </Link>

        {isAdmin && (
          <Link
            href="/Admin_dashboard"
            onClick={handleClose}
            className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
          >
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
            Admin
          </Link>
        )}

        {isAdmin && (
          <Link
            href="/user_results"
            onClick={handleClose}
            className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            User results
          </Link>
        )}
      </div>
    </div>
  );
}
