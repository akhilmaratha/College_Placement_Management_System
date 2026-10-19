"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Bell, Menu, Search } from "lucide-react";

export default function StudentTopBar({
  title = "Overview",
  breadcrumb = "Student / Overview",
  student,
  onMenuClick,
}) {
  const searchId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const displayName = student?.displayName ?? "Student";
  const initials = student?.initials ?? "ST";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          className="rounded-[10px] p-2 text-secondary-text outline-none hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-secondary-text">
            {breadcrumb}
          </p>
          <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h1>
        </div>

        <div className="hidden items-center md:flex">
          <label htmlFor={searchId} className="sr-only">
            Search opportunities
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-text" />
            <input
              id={searchId}
              type="search"
              placeholder="Search jobs…"
              className="w-56 rounded-[10px] border border-border bg-white py-2 pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-secondary-text/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 lg:w-64"
            />
          </div>
        </div>

        <button
          type="button"
          className="rounded-[10px] p-2 text-secondary-text outline-none hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-2 rounded-[10px] border border-border bg-white py-1.5 pl-1.5 pr-2.5 outline-none transition hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-primary text-xs font-semibold text-white">
              {initials}
            </span>
            <span className="hidden max-w-[8rem] truncate text-sm font-medium text-foreground sm:inline">
              {displayName}
            </span>
          </button>

          {menuOpen ? (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-44 rounded-[12px] border border-border bg-card p-1.5 shadow-md"
            >
              <Link
                href="/student/profile"
                role="menuitem"
                className="block rounded-[8px] px-3 py-2 text-sm text-foreground outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
                onClick={() => setMenuOpen(false)}
              >
                My Profile
              </Link>
              <Link
                href="/login"
                role="menuitem"
                className="block rounded-[8px] px-3 py-2 text-sm text-foreground outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
                onClick={() => setMenuOpen(false)}
              >
                Logout
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
