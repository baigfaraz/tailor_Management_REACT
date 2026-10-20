import { Link, NavLink } from "react-router";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";
import { Container, SkipLink } from "./layout";
import { Logo } from "./logo";

/**
 * App frame: white sidebar on large screens (lg+), top bar with the same
 * links on tablets and phones, and the page in <main id="main">.
 *
 *   <AppShell nav={[{ to: "/Home", label: "Home", icon: House, end: true }]}>…</AppShell>
 */
export function AppShell({ nav, children }) {
  return (
    <div className="min-h-dvh bg-canvas lg:flex">
      <SkipLink />
      <aside className="border-b border-border bg-surface lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-(--sidebar-width) lg:shrink-0 lg:flex-col lg:gap-8 lg:border-r lg:border-b-0 lg:px-4 lg:py-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 lg:flex-col lg:items-stretch lg:gap-8 lg:p-0">
          <Link
            to="/Home"
            aria-label="Tailor home"
            className="w-fit rounded-md lg:px-2"
          >
            <Logo />
          </Link>
          <nav aria-label="Main">
            <ul className="m-0 flex list-none flex-wrap gap-1 p-0 lg:flex-col">
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        "flex h-(--control-md) items-center gap-3 rounded-md px-3 text-base no-underline transition-colors duration-(--duration-fast)",
                        isActive
                          ? "bg-primary font-medium text-inverse"
                          : "text-muted hover:bg-ghost-hover hover:text-fg",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.icon && <Icon icon={item.icon} />}
                        {item.label}
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="ml-auto size-2 rounded-full bg-brand max-lg:hidden"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
      <main id="main" tabIndex={-1} className="min-w-0 flex-1 outline-none">
        <Container className="py-8 lg:py-10">{children}</Container>
      </main>
    </div>
  );
}
