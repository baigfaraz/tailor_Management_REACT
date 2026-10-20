import { cva } from "class-variance-authority";
import { CircleAlert, CircleCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

const alertVariants = cva(
  "flex items-start gap-3 rounded-md border px-4 py-3 text-sm",
  {
    variants: {
      tone: {
        danger: "border-danger-border bg-danger-bg text-danger-fg",
        success: "border-transparent bg-success-bg text-success-fg",
        info: "border-transparent bg-info-bg text-info-fg",
      },
    },
    defaultVariants: { tone: "info" },
  },
);

const ICONS = { danger: CircleAlert, success: CircleCheck, info: Info };

/**
 * Inline message that stays on screen (form errors, failed loads).
 * Danger alerts are announced immediately (role="alert"); others politely.
 * For short confirmations that disappear, use toast() instead.
 */
export function Alert({ tone = "info", title, children, action, className }) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn(alertVariants({ tone }), className)}
    >
      <Icon icon={ICONS[tone]} className="mt-0.5" />
      <div className="flex flex-1 flex-col gap-1">
        {title && <p className="font-medium">{title}</p>}
        {children && <div>{children}</div>}
      </div>
      {action}
    </div>
  );
}
