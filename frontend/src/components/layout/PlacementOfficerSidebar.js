"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarClock,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Users,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/placement-officer/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/placement-officer/students",
    label: "Students",
    icon: Users,
  },
  {
    href: "/placement-officer/drives",
    label: "Placement Drives",
    icon: CalendarDays,
  },
  {
    href: "/placement-officer/interviews",
    label: "Interviews",
    icon: CalendarClock,
  },
  {
    label: "Reports",
    icon: BarChart3,
    disabled: true,
  },
];

function isActivePath(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function PlacementOfficerSidebar({ open = false, onClose }) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-foreground/30 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card shadow-sm transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Placement officer navigation"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Link
            href="/placement-officer/dashboard"
            className="flex min-w-0 items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            onClick={onClose}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary text-white">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="truncate text-sm font-semibold tracking-tight text-foreground">
              CampusPlacements
            </span>
          </Link>
          <button
            type="button"
            className="rounded-[10px] p-2 text-secondary-text outline-none hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40 lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map(({ href, label, icon: Icon, disabled }) => {
            if (disabled) {
              return (
                <span
                  key={label}
                  title="Not available yet"
                  className="flex cursor-not-allowed items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium text-secondary-text/60"
                  aria-disabled="true"
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="flex-1 truncate">{label}</span>
                  <span className="text-[10px] font-medium uppercase tracking-wide">
                    Soon
                  </span>
                </span>
              );
            }

            const active = isActivePath(pathname, href);

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40 ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-secondary-text hover:bg-background hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <Link
            href="/login"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium text-secondary-text outline-none transition hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Logout
          </Link>
        </div>
      </aside>
    </>
  );
}
