import { useId } from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";
import { Label } from "./label";

// Adapted from shadcn/ui Checkbox (Radix), styled with our tokens.
/**
 * Checkbox with its label. Controlled (`checked` + `onCheckedChange`) or
 * uncontrolled (`defaultChecked`). The whole row is a 44px touch target.
 */
export function Checkbox({ label, id: idProp, className, ...props }) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <div
      className={cn(
        "inline-flex min-h-(--control-md) items-center gap-3",
        className,
      )}
    >
      <CheckboxPrimitive.Root
        id={id}
        data-slot="checkbox"
        className={cn(
          "peer flex size-5.5 shrink-0 items-center justify-center rounded-sm border border-input bg-surface",
          "transition-colors duration-(--duration-fast) hover:border-input-hover",
          "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-on-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator>
          <Icon icon={Check} size="sm" className="stroke-3" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <Label htmlFor={id} className="text-base font-normal">
        {label}
      </Label>
    </div>
  );
}
