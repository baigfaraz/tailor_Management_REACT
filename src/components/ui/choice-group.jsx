import { useId } from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

/**
 * Single choice from a few options, shown as pill chips (Radix RadioGroup:
 * arrow keys move between options, one tab stop). Use for 2–5 options;
 * longer lists need a Select.
 *
 *   <ChoiceGroup legend="Dress" required value={dress} onValueChange={setDress}
 *     options={[{ value: "Kurta", label: "Kurta" }, { value: "Shalwar", label: "Shalwar" }]} />
 */
export function ChoiceGroup({
  legend,
  options,
  required = false,
  className,
  ...props
}) {
  const legendId = useId();
  return (
    <div
      data-slot="choice-group"
      className={cn("flex flex-col gap-2", className)}
    >
      <span id={legendId} className="text-sm font-medium text-fg">
        {legend}
        {required && (
          <span aria-hidden="true" className="text-muted">
            {" "}
            *
          </span>
        )}
      </span>
      <RadioGroupPrimitive.Root
        aria-labelledby={legendId}
        aria-required={required || undefined}
        className="flex flex-wrap gap-2"
        {...props}
      >
        {options.map((option) => (
          <RadioGroupPrimitive.Item
            key={option.value}
            value={option.value}
            className={cn(
              "inline-flex h-(--control-md) items-center rounded-full border-2 border-outline bg-surface px-5 text-base text-fg",
              "transition-colors duration-(--duration-fast) hover:bg-secondary-hover",
              "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:font-medium data-[state=checked]:text-inverse",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {option.label}
          </RadioGroupPrimitive.Item>
        ))}
      </RadioGroupPrimitive.Root>
    </div>
  );
}
