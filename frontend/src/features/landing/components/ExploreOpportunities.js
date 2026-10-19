import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Public jobs preview.
 * Jobs APIs are not confirmed yet — do not render mock/fake listings here.
 */
export default function ExploreOpportunities() {
  return (
    <section
      id="explore"
      className="border-b border-border bg-card"
      aria-labelledby="explore-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2
              id="explore-heading"
              className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl"
            >
              Explore opportunities
            </h2>
            <p className="mt-2 text-sm leading-6 text-secondary-text sm:text-base">
              Open roles from the placement portal will appear here once the
              jobs service is connected.
            </p>
          </div>
          <Link
            href="/student/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-info outline-none hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            View all
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 rounded-[12px] border border-dashed border-border bg-background px-6 py-12 text-center">
          <p className="text-sm font-medium text-foreground">
            No open roles to show yet
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-secondary-text">
            Browse the jobs page for the current listing UI, or check back after
            the placements API is available.
          </p>
          <Link
            href="/student/jobs"
            className="mt-6 inline-flex items-center justify-center rounded-[10px] border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground outline-none transition hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
          >
            Go to Browse Jobs
          </Link>
        </div>
      </div>
    </section>
  );
}
