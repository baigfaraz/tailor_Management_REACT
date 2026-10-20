import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

/** Form label (Radix Label: clicking focuses the linked control). */
export function Label({ className, ...props }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn("text-sm font-medium text-fg select-none", className)}
      {...props}
    />
  );
}
