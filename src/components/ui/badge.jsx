import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "bg-subtle text-fg",
        success: "bg-success-bg text-success-fg",
        warning: "bg-warning-bg text-warning-fg",
        accent: "bg-accent-bg text-accent-fg",
        danger: "bg-danger-bg text-danger-fg",
        info: "bg-info-bg text-info-fg",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

/**
 * Small status label. Always give it text; `icon` adds a second cue so
 * status never depends on color alone.
 */
export function Badge({ tone, icon, className, children }) {
  return (
    <span className={cn(badgeVariants({ tone }), className)}>
      {icon && <Icon icon={icon} size="sm" />}
      {children}
    </span>
  );
}
