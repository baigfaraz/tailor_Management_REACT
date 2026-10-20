import { cn } from "@/lib/utils";

// Layout primitives. Gaps come from a fixed map so only token spacing is used.
const GAPS = {
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
  12: "gap-12",
};

/** Page-width container with responsive side gutters. */
export function Container({ as: Comp = "div", className, ...props }) {
  return (
    <Comp
      className={cn(
        "mx-auto w-full max-w-(--content-max) px-4 sm:px-6 lg:px-10",
        className,
      )}
      {...props}
    />
  );
}

/** Vertical stack with even spacing. */
export function Stack({ as: Comp = "div", gap = 4, className, ...props }) {
  return (
    <Comp className={cn("flex flex-col", GAPS[gap], className)} {...props} />
  );
}

/** Horizontal group that wraps on small screens (buttons, chips). */
export function Cluster({
  as: Comp = "div",
  gap = 3,
  align = "center",
  justify = "start",
  className,
  ...props
}) {
  return (
    <Comp
      className={cn(
        "flex flex-wrap",
        GAPS[gap],
        {
          start: "items-start",
          center: "items-center",
          end: "items-end",
          baseline: "items-baseline",
        }[align],
        {
          start: "justify-start",
          between: "justify-between",
          end: "justify-end",
        }[justify],
        className,
      )}
      {...props}
    />
  );
}

const COLUMNS = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/** Responsive grid: one column on phones, `cols` from tablet/desktop up. */
export function Grid({
  as: Comp = "div",
  cols = 3,
  gap = 4,
  className,
  ...props
}) {
  return (
    <Comp
      className={cn("grid grid-cols-1", COLUMNS[cols], GAPS[gap], className)}
      {...props}
    />
  );
}

/** Text for screen readers only. */
export function VisuallyHidden({ as: Comp = "span", ...props }) {
  return <Comp className="sr-only" {...props} />;
}

/** First focusable element: jumps keyboard users to the main content. */
export function SkipLink({ href = "#main", children = "Skip to content" }) {
  return (
    <a
      href={href}
      className="sr-only rounded-md bg-primary px-4 py-2 text-on-primary focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-(--z-tooltip)"
    >
      {children}
    </a>
  );
}
