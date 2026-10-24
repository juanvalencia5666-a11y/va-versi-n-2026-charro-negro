import { NAV_ITEMS } from "@/lib/sections";
import { Menu, Moon, X } from "lucide-react";
import { useEffect, useState } from "react";

interface SiteHeaderProps {
  activeId: string | null;
}

export function SiteHeader({ activeId }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      data-ocid="site.header"
      className={[
        "fixed inset-x-0 top-0 z-50 border-b transition-smooth",
        scrolled
          ? "border-border bg-background/85 backdrop-blur-md shadow-subtle"
          : "border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#portada"
          data-ocid="site.logo_link"
          className="group flex items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-ember transition-smooth group-hover:border-accent/60">
            <Moon className="size-4" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-sm tracking-wide text-foreground">
              Charro Negro
            </span>
            <span className="text-kicker text-[0.6rem] text-muted-foreground">
              Leyenda Mexicana
            </span>
          </span>
        </a>

        <nav
          aria-label="Secciones"
          className="hidden items-center gap-1 md:flex"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-ocid={`nav.${item.id}.link`}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "relative rounded-sm px-3 py-2 text-kicker transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={[
                    "absolute inset-x-3 -bottom-px h-px origin-left transition-transform duration-300",
                    isActive ? "scale-x-100 bg-accent" : "scale-x-0 bg-border",
                  ].join(" ")}
                />
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          data-ocid="nav.menu_toggle"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex size-10 items-center justify-center rounded-sm border border-border bg-card text-foreground transition-smooth hover:border-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
        >
          {open ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {open ? (
        <nav
          aria-label="Secciones móvil"
          className="border-t border-border bg-background/95 backdrop-blur-md md:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col px-5 py-3 sm:px-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  data-ocid={`nav.mobile.${item.id}.link`}
                  onClick={() => setOpen(false)}
                  className="block rounded-sm px-2 py-3 text-kicker text-muted-foreground transition-smooth hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
