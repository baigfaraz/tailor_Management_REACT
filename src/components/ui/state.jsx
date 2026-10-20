import { CircleAlert, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";
import { Skeleton } from "./skeleton";

function StateFrame({ icon, title, description, action, role, className }) {
  return (
    <div
      role={role}
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl bg-surface px-6 py-12 text-center shadow-card",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-subtle text-muted">
        <Icon icon={icon} size="xl" />
      </span>
      <p className="font-display text-2xl tracking-tight">{title}</p>
      {description && (
        <p className="max-w-md text-base text-muted">{description}</p>
      )}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

/** Nothing to show yet, with the next step as `action`. */
export function EmptyState({ icon = Inbox, ...props }) {
  return <StateFrame icon={icon} {...props} />;
}

/** Something failed; `action` is usually a Retry button. Announced. */
export function ErrorState({ icon = CircleAlert, ...props }) {
  return <StateFrame icon={icon} role="alert" {...props} />;
}

/** Skeleton rows for a list that is loading. */
export function LoadingRows({ rows = 3, label = "Loading" }) {
  return (
    <div
      role="status"
      className="flex flex-col gap-3 rounded-xl bg-surface p-6 shadow-card"
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}
