import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

/**
 * Loading indicator. With `label` it announces itself (role="status");
 * without, it is decorative (e.g. inside a button that sets aria-busy).
 */
export function Spinner({ size = "md", label, className }) {
  const spinner = (
    <Icon
      icon={LoaderCircle}
      size={size}
      className={cn("animate-spin motion-reduce:animate-none", className)}
    />
  );
  if (!label) return spinner;
  return (
    <span role="status" className="inline-flex items-center gap-2">
      {spinner}
      <span className="sr-only">{label}</span>
    </span>
  );
}
