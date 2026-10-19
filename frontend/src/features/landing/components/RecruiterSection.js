import Link from "next/link";

export default function RecruiterSection() {
  return (
    <section
      id="recruiters"
      className="border-b border-border bg-card"
      aria-labelledby="recruiters-heading"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-xl">
          <h2
            id="recruiters-heading"
            className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl"
          >
            Hiring from campus?
          </h2>
          <p className="mt-2 text-sm leading-6 text-secondary-text sm:text-base">
            Post roles, review applicants, and coordinate with the placement
            office through the recruiter workspace.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex shrink-0 items-center justify-center rounded-[10px] bg-primary px-5 py-2.5 text-sm font-semibold text-white outline-none transition hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
        >
          Recruiter Login
        </Link>
      </div>
    </section>
  );
}
