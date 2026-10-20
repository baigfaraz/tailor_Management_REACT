import { Children, cloneElement, useId } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";
import { Label } from "./label";

/**
 * Label + control + hint + error, wired for screen readers: the control gets
 * the id, aria-describedby (hint, error), aria-invalid and aria-required.
 * The child must be one control that forwards these props (Input does).
 *
 *   <Field label="Waist" required error={errors.waist}>
 *     <Input suffix="in" inputMode="decimal" … />
 *   </Field>
 */
export function Field({
  label,
  hint,
  error,
  required = false,
  id: idProp,
  className,
  children,
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const control = cloneElement(Children.only(children), {
    id,
    "aria-describedby": describedBy,
    "aria-invalid": error ? true : undefined,
    "aria-required": required || undefined,
  });

  return (
    <div data-slot="field" className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {required && (
          <span aria-hidden="true" className="text-muted">
            {" "}
            *
          </span>
        )}
      </Label>
      {control}
      {hint && (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          className="flex items-center gap-1.5 text-sm text-danger-fg"
        >
          <Icon icon={CircleAlert} size="sm" />
          {error}
        </p>
      )}
    </div>
  );
}
