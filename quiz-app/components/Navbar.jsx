import { dbUser, syncUser } from "../app/actions/user.action";
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { BarChart3, Home, ShieldCheck, Trophy } from "lucide-react";

async function Navbar() {
  await syncUser();

  const user = await dbUser();
  const isAdmin =
    user?.email === process.env.ADMIN_EMAIL;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[72px] lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            Q
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-extrabold leading-none tracking-tight text-slate-900">
              Quiz<span className="text-indigo-600">App</span>
            </span>

            <span className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400 sm:block">
              Learn • Practice • Win
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Show when="signed-in">
            <div className="mr-1 hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 sm:flex">
              <Link
                href="/"
                className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-white hover:text-slate-950 hover:shadow-sm"
              >
                <Home className="h-3.5 w-3.5" />
                Home
              </Link>

              <Link
                href="/scores"
                className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-white hover:text-slate-950 hover:shadow-sm"
              >
                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                My Scores
              </Link>

              {isAdmin && (
                <Link
                  href="/Admin_dashboard"
                  className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-white hover:text-slate-950 hover:shadow-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Admin
                </Link>
              )}
            </div>

            {/* User */}
            <div className="rounded-full border border-slate-200 bg-white p-0.5 shadow-sm transition-shadow hover:shadow-md">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
              />
            </div>
          </Show>

          <Show when="signed-out">
            <div className="flex items-center gap-2">
              <SignInButton>
                <button
                  type="button"
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 hover:shadow-md sm:px-5"
                >
                  Login
                </button>
              </SignInButton>

              <SignUpButton>
                <button
                  type="button"
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 sm:px-5"
                >
                  Get Started
                </button>
              </SignUpButton>
            </div>
          </Show>
        </div>
      </div>

      {/* Mobile Navigation */}
      <Show when="signed-in">
        <div className="border-t border-slate-100 bg-white px-4 py-2 sm:hidden">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>

            <Link
              href="/scores"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
            >
              <Trophy className="h-4 w-4 text-amber-500" />
              Scores
            </Link>

            {isAdmin && (
              <Link
                href="/Admin_dashboard"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
              >
                <ShieldCheck className="h-4 w-4 text-indigo-500" />
                Admin
              </Link>
            )}
          </div>
        </div>
      </Show>
    </nav>
  );
}

export default Navbar;