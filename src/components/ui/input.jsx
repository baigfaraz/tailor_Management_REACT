import { cn } from "@/lib/utils";

const FIELD_BOX = [
  "h-(--control-md) w-full min-w-0 rounded-md border border-input bg-surface text-base text-fg",
  "transition-colors duration-(--duration-fast) hover:border-input-hover",
  "disabled:cursor-not-allowed disabled:opacity-50",
];

const INVALID = "border-2 border-danger hover:border-danger";

/**
 * Text input. `prefix`/`suffix` show a unit inside the box ("Rs", "in").
 * Pass `invalid` (or let Field set aria-invalid) for the error style.
 * Font size stays 16px so phones do not zoom in.
 */
export function Input({
  prefix,
  suffix,
  invalid,
  className,
  "aria-invalid": ariaInvalid,
  ...props
}) {
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true";

  if (!prefix && !suffix) {
    return (
      <input
        data-slot="input"
        aria-invalid={isInvalid || undefined}
        className={cn(
          FIELD_BOX,
          "px-3 placeholder:text-placeholder",
          isInvalid && INVALID,
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <div
      data-slot="input"
      className={cn(
        FIELD_BOX,
        "flex items-center gap-2 px-3",
        "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus",
        isInvalid && INVALID,
        className,
      )}
    >
      {prefix && <span className="text-sm text-muted">{prefix}</span>}
      <input
        aria-invalid={isInvalid || undefined}
        className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-placeholder"
        {...props}
      />
      {suffix && <span className="text-sm text-muted">{suffix}</span>}
    </div>
  );
}
