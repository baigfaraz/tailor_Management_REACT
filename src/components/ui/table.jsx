import { cn } from "@/lib/utils";

/*
 * Responsive data table. From tablet (md) up it is a normal table; on phones
 * each row becomes a card and every cell shows its column `label`. Header
 * cells stay in the accessibility tree on phones (sr-only), so screen readers
 * keep column names. Put interactive elements (links, buttons) in cells;
 * never make a row or cell clickable on its own (keyboard users can't reach it).
 */

export function Table({ className, caption, children, ...props }) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface shadow-card">
      <table
        className={cn("w-full border-collapse text-sm max-md:block", className)}
        {...props}
      >
        {caption && <caption className="sr-only">{caption}</caption>}
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, ...props }) {
  return <thead className={cn("max-md:sr-only", className)} {...props} />;
}

export function TableBody({ className, ...props }) {
  return <tbody className={cn("max-md:block", className)} {...props} />;
}

export function TableRow({ className, ...props }) {
  return (
    <tr
      className={cn(
        "border-t border-border transition-colors duration-(--duration-fast) first:border-t-0 hover:bg-surface-hover",
        "max-md:grid max-md:gap-2 max-md:px-4 max-md:py-4",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({ className, align = "left", ...props }) {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-3 text-sm font-medium whitespace-nowrap text-muted",
        align === "right" ? "text-right" : "text-left",
        className,
      )}
      {...props}
    />
  );
}

/** `label` is shown before the value on phones (the column name). */
export function TableCell({
  label,
  align = "left",
  className,
  children,
  ...props
}) {
  return (
    <td
      className={cn(
        "px-4 py-3 align-middle",
        align === "right" ? "md:text-right" : "text-left",
        "max-md:flex max-md:min-h-(--control-sm) max-md:items-center max-md:justify-between max-md:gap-4 max-md:p-0",
        className,
      )}
      {...props}
    >
      {label && (
        <span aria-hidden="true" className="text-sm text-muted md:hidden">
          {label}
        </span>
      )}
      {children}
    </td>
  );
}
