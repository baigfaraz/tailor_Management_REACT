import { cn } from "@/lib/utils";

/**
 * Read-only label/value pairs in a responsive grid.
 *   <DescriptionList items={[{ term: "Waist", value: "32 Inches" }]} />
 */
export function DescriptionList({ items, className }) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3",
        className,
      )}
    >
      {items.map(({ term, value }) => (
        <div key={term} className="flex min-w-0 flex-col gap-0.5">
          <dt className="text-sm text-muted">{term}</dt>
          <dd className="m-0 text-base font-medium break-words">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
