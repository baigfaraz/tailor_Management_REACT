import { cn } from "@/lib/utils";

/** Surface for grouped content. `raised` for stat-style cards. */
export function Card({
  as: Comp = "div",
  raised = false,
  className,
  ...props
}) {
  return (
    <Comp
      data-slot="card"
      className={cn(
        "flex flex-col rounded-xl bg-surface text-fg",
        raised ? "shadow-raised" : "shadow-card",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col gap-1 px-6 pt-6", className)}
      {...props}
    />
  );
}

/** Card heading; pick the level that fits the page outline (default h2). */
export function CardTitle({ as: Comp = "h2", className, ...props }) {
  return (
    <Comp
      className={cn(
        "font-display text-2xl font-normal tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm text-muted", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return (
    <div className={cn("flex flex-col gap-4 p-6", className)} {...props} />
  );
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 border-t border-border px-6 py-4",
        className,
      )}
      {...props}
    />
  );
}
