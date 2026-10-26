import { AlertCircle, Inbox, LoaderCircle } from "lucide-react";

export function StudentErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="rounded-[12px] border border-error/30 bg-error-bg px-5 py-8 text-center">
      <AlertCircle className="mx-auto h-6 w-6 text-error" aria-hidden="true" />
      <p className="mt-3 text-sm text-error">{message}</p>
      {onRetry ? <button type="button" onClick={onRetry} className="mt-4 rounded-[10px] bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">Try again</button> : null}
    </div>
  );
}

export function StudentUnavailableState({ message }) {
  return <StudentErrorState message={message} />;
}

export function StudentEmptyState({ message }) {
  return <div className="rounded-[12px] border border-border bg-card px-5 py-12 text-center"><Inbox className="mx-auto h-7 w-7 text-secondary-text" aria-hidden="true" /><p className="mt-3 text-sm text-secondary-text">{message}</p></div>;
}

export function StudentLoadingState({ label = "Loading" }) {
  return <div className="flex items-center justify-center rounded-[12px] border border-border bg-card px-5 py-12 text-sm text-secondary-text"><LoaderCircle className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />{label}…</div>;
}
