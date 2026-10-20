import { Scissors } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

export const APP_NAME = "Tailor";

/** Brand mark: lime tile with scissors + the "Tailor" wordmark. */
export function Logo({ className }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span className="flex size-9 items-center justify-center rounded-lg bg-brand text-fg">
        <Icon icon={Scissors} size="lg" />
      </span>
      <span className="font-display text-2xl font-normal tracking-tight">
        {APP_NAME}
      </span>
    </span>
  );
}
