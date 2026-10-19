"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, GraduationCap, LogOut, Menu, LayoutDashboard, X } from "lucide-react";
import {
  getCurrentUser,
  getDashboardPathForRole,
  logout,
} from "@/services/authService";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/student/jobs", label: "Explore Jobs" },
  { href: "/#recruiters", label: "For Recruiters" },
  { href: "/#about", label: "About" },
];

function formatRoleLabel(role) {
  if (!role) return "";
  return String(role)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getInitials(user) {
  if (user?.initials) return user.initials;
  const name = user?.name?.trim() ?? "";
  if (!name) return "?";
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function LandingNavbar() {
  const menuButtonId = useId();
  const userMenuButtonId = useId();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authResolved, setAuthResolved] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const sessionUser = await getCurrentUser();
        if (!cancelled) {
          setUser(sessionUser);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setAuthResolved(true);
        }
      }
    }

    loadSession();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return undefined;

    function handlePointerDown(event) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [userMenuOpen]);

  async function handleLogout() {
    setUserMenuOpen(false);
    setMobileOpen(false);
    await logout();
    setUser(null);
  }

  const dashboardHref = user ? getDashboardPathForRole(user.role) : "/login";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 rounded-[8px] outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-primary text-white">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
            CampusPlacements
          </span>
        </Link>

        <nav
          className="ml-2 hidden items-center gap-1 md:flex"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[8px] px-3 py-2 text-sm font-medium text-secondary-text outline-none transition hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {authResolved && user ? (
            <div className="relative hidden md:block" ref={userMenuRef}>
              <button
                id={userMenuButtonId}
                type="button"
                className="flex items-center gap-2 rounded-[10px] border border-border bg-white py-1.5 pl-1.5 pr-2.5 text-left outline-none transition hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
                onClick={() => setUserMenuOpen((open) => !open)}
              >
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-[8px] object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-primary text-xs font-semibold text-white">
                    {getInitials(user)}
                  </span>
                )}
                <span className="max-w-[9rem] truncate text-sm font-medium text-foreground">
                  {user.name}
                </span>
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-secondary-text"
                  aria-hidden="true"
                />
              </button>

              {userMenuOpen ? (
                <div
                  role="menu"
                  aria-labelledby={userMenuButtonId}
                  className="absolute right-0 mt-2 w-56 rounded-[12px] border border-border bg-card p-1.5 shadow-md"
                >
                  <div className="border-b border-border px-3 py-2">
                    <p className="truncate text-sm font-medium text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-secondary-text">
                      {formatRoleLabel(user.role)}
                    </p>
                  </div>
                  <Link
                    href={dashboardHref}
                    role="menuitem"
                    className="mt-1 flex items-center gap-2 rounded-[8px] px-3 py-2 text-sm text-foreground outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                    Go to Dashboard
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-sm text-foreground outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : authResolved ? (
            <Link
              href="/login"
              className="hidden rounded-[10px] bg-primary px-3.5 py-2 text-sm font-semibold text-white outline-none transition hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 md:inline-flex"
            >
              Login
            </Link>
          ) : (
            <span
              className="hidden h-9 w-20 rounded-[10px] bg-border/60 md:block"
              aria-hidden="true"
            />
          )}

          <button
            id={menuButtonId}
            type="button"
            className="rounded-[10px] p-2 text-secondary-text outline-none hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40 md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="landing-mobile-nav"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span className="sr-only">
              {mobileOpen ? "Close menu" : "Open menu"}
            </span>
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="landing-mobile-nav"
          className="border-t border-border bg-card px-4 py-3 md:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-[8px] px-3 py-2.5 text-sm font-medium text-foreground outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-3 border-t border-border pt-3">
            {authResolved && user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-1">
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt=""
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-[8px] object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-primary text-xs font-semibold text-white">
                      {getInitials(user)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-secondary-text">
                      {formatRoleLabel(user.role)}
                    </p>
                  </div>
                </div>
                <Link
                  href={dashboardHref}
                  className="flex items-center gap-2 rounded-[8px] px-3 py-2.5 text-sm font-medium text-foreground outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                  Go to Dashboard
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2.5 text-left text-sm font-medium text-foreground outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-[10px] bg-primary px-4 py-2.5 text-sm font-semibold text-white outline-none transition hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
