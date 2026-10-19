import Link from "next/link";
import { connection } from "next/server";
import { GraduationCap } from "lucide-react";

function FooterShell({ year }) {
  return (
    <footer className="bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6 lg:px-8">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-primary text-white">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold text-foreground">
              CampusPlacements
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-secondary-text">
            University placement portal for students, recruiters, and campus
            placement teams.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <li>
              <Link
                href="/"
                className="font-medium text-secondary-text outline-none hover:text-foreground focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/student/jobs"
                className="font-medium text-secondary-text outline-none hover:text-foreground focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Explore Jobs
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="font-medium text-secondary-text outline-none hover:text-foreground focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-secondary-text sm:px-6 lg:px-8">
          ©{year ? ` ${year}` : ""} CampusPlacements. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export function LandingFooterFallback() {
  return <FooterShell year={null} />;
}

export default async function LandingFooter() {
  await connection();
  const year = new Date().getFullYear();
  return <FooterShell year={year} />;
}
