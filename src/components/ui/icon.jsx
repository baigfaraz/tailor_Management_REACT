import { cn } from "@/lib/utils";

const SIZES = {
  sm: "size-4",
  md: "size-4.5",
  lg: "size-5",
  xl: "size-6",
};

/**
 * Renders a Lucide icon (the app's one icon set) at a token size.
 * Decorative by default (aria-hidden); pass `label` when the icon alone
 * carries meaning.
 *
 *   <Icon icon={Users} />            decorative
 *   <Icon icon={Lock} label="Locked" />
 */
export function Icon({ icon: IconComponent, size = "md", label, className }) {
  return (
    <IconComponent
      className={cn(SIZES[size], "shrink-0", className)}
      strokeWidth={1.75}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      focusable="false"
    />
  );
}
