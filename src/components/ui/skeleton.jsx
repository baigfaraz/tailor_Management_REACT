import { cn } from "@/lib/utils";

/** Placeholder block shown while content loads. Size it with classes. */
export function Skeleton({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md bg-skeleton motion-reduce:animate-none",
        className,
      )}
    />
  );
}
