export default function SummaryCard({ label, value, icon: Icon, loading = false }) {
  return (
    <article className="rounded-[12px] border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-secondary-text">{label}</p>
          {loading ? (
            <div
              className="mt-3 h-8 w-16 animate-pulse rounded-md bg-border/70"
              aria-hidden="true"
            />
          ) : (
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              {value}
            </p>
          )}
        </div>
        {Icon ? (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
      </div>
    </article>
  );
}
