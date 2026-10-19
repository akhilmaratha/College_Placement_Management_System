"use client";

import { useId, useState } from "react";
import { Bell, Menu, Search } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminShell({
  children,
  title = "Admin Dashboard",
  breadcrumb = "Dashboard / Overview",
  admin,
}) {
  const searchId = useId();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const displayName = admin?.displayName ?? "Admin";
  const role = admin?.role ?? "Placement Officer";
  const initials = admin?.initials ?? "AD";

  return (
    <div className="flex min-h-full flex-1 bg-background">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <button
              type="button"
              className="rounded-[10px] p-2 text-secondary-text outline-none hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40 lg:hidden"
              onClick={() => setSidebarOpen(true)}
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
                Search
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-text" />
                <input
                  id={searchId}
                  type="search"
                  placeholder="Search…"
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

            <div className="flex items-center gap-2 rounded-[10px] border border-border bg-white py-1.5 pl-1.5 pr-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-primary text-xs font-semibold text-white">
                {initials}
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block max-w-[8rem] truncate text-sm font-medium text-foreground">
                  {displayName}
                </span>
                <span className="block max-w-[8rem] truncate text-xs text-secondary-text">
                  {role}
                </span>
              </span>
            </div>
          </div>
        </header>
        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
