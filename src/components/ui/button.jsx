import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

// Adapted from shadcn/ui (radix-nova) Button, styled with our tokens.
export const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border-2 font-medium whitespace-nowrap select-none",
    "transition-colors duration-(--duration-fast) ease-(--ease-standard)",
    "disabled:pointer-events-none disabled:opacity-50 aria-busy:cursor-progress",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        // The one main action of a view: ink fill, lime text.
        primary:
          "border-transparent bg-primary text-on-primary shadow-xs hover:bg-primary-hover",
        // Second action next to a primary: lavender outline.
        secondary: "border-outline bg-surface text-fg hover:bg-secondary-hover",
        // Low-emphasis actions (toolbars, icon buttons).
        ghost: "border-transparent bg-transparent text-fg hover:bg-ghost-hover",
        // Destructive confirmations only.
        danger:
          "border-transparent bg-danger text-inverse shadow-xs hover:bg-danger-hover",
      },
      size: {
        sm: "h-(--control-sm) px-3 text-sm",
        md: "h-(--control-md) px-5 text-base",
        lg: "h-(--control-lg) px-6 text-base",
        icon: "size-(--control-md) p-0",
        "icon-sm": "size-(--control-sm) p-0",
      },
      fullWidth: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

/**
 * Button. `variant`: primary | secondary | ghost | danger.
 * `size`: sm | md | lg | icon | icon-sm. `loading` shows a spinner and
 * blocks clicks. `asChild` renders the child element (e.g. a router Link)
 * with button styles.
 */
export function Button({
  variant,
  size,
  fullWidth,
  loading = false,
  disabled,
  asChild = false,
  className,
  children,
  type,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={asChild ? undefined : disabled || loading}
      aria-busy={loading || undefined}
      type={asChild ? undefined : (type ?? "button")}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading && <Spinner size="sm" />}
          {children}
        </>
      )}
    </Comp>
  );
}

/**
 * Icon-only button. `label` is required: it is the accessible name and the
 * tooltip text.
 */
export function IconButton({
  label,
  size = "icon",
  variant = "ghost",
  ...props
}) {
  return (
    <Button
      size={size}
      variant={variant}
      aria-label={label}
      title={label}
      {...props}
    />
  );
}
