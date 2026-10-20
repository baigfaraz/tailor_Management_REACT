import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

/**
 * Page title (the page's only h1) with optional back link, description and
 * actions. Actions wrap under the title on narrow screens.
 */
export function PageHeader({ title, description, back, actions, className }) {
  return (
    <header
      className={cn(
        "flex flex-wrap items-end justify-between gap-4 pb-6",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        {back && (
          <Link
            to={back.to}
            className="inline-flex w-fit items-center gap-1.5 rounded-sm text-sm text-muted hover:text-fg"
          >
            <Icon icon={ArrowLeft} size="sm" />
            {back.label}
          </Link>
        )}
        <h1 className="font-display text-4xl font-normal tracking-tight md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="text-base font-light text-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </header>
  );
}
