import Link from "next/link";

function formatDeadline(isoDate) {
  if (!isoDate) {
    return "—";
  }

  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

export default function OpportunityRow({ opportunity }) {
  const { company, jobTitle, eligibility, minCgpa, deadline, id } = opportunity;

  return (
    <li className="grid gap-3 border-b border-border px-4 py-4 last:border-b-0 sm:grid-cols-[1.4fr_1fr_0.8fr_auto] sm:items-center sm:gap-4 sm:px-5">
      <div className="min-w-0">
        <p className="truncate font-semibold text-foreground">{jobTitle}</p>
        <p className="mt-0.5 truncate text-sm text-secondary-text">{company}</p>
      </div>
      <p className="text-sm text-secondary-text">
        {eligibility || (minCgpa ? `Min CGPA ${minCgpa}` : "—")}
      </p>
      <p className="text-sm text-foreground">
        <span className="text-secondary-text sm:hidden">Deadline: </span>
        {formatDeadline(deadline)}
      </p>
      <div className="sm:justify-self-end">
        <Link
          href={`/student/jobs/${id}`}
          className="inline-flex items-center justify-center rounded-[10px] border border-border bg-white px-3 py-1.5 text-sm font-medium text-primary outline-none transition hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          View Details
        </Link>
      </div>
    </li>
  );
}
