const STATUS_STYLES = {
  Applied: "bg-info-bg text-info border-info/20",
  "Not Applied": "bg-background text-secondary-text border-border",
  Shortlisted: "bg-primary/10 text-primary border-primary/20",
  "Interview Scheduled": "bg-warning-bg text-warning border-warning/25",
  Selected: "bg-success-bg text-success border-success/25",
  Rejected: "bg-error-bg text-error border-error/25",
  Draft: "bg-background text-secondary-text border-border",
  Complete: "bg-success-bg text-success border-success/25",
  Published: "bg-success-bg text-success border-success/25",
  Closed: "bg-error-bg text-error border-error/25",
  Open: "bg-success-bg text-success border-success/25",
  Upcoming: "bg-info-bg text-info border-info/20",
  Scheduled: "bg-warning-bg text-warning border-warning/25",
  Completed: "bg-success-bg text-success border-success/25",
  Cancelled: "bg-error-bg text-error border-error/25",
  Placed: "bg-success-bg text-success border-success/25",
  "In Process": "bg-warning-bg text-warning border-warning/25",
  Unplaced: "bg-background text-secondary-text border-border",
};

export default function StatusBadge({ status }) {
  const styles = STATUS_STYLES[status] ?? "bg-background text-secondary-text border-border";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles}`}
    >
      {status}
    </span>
  );
}
