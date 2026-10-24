import { SECTIONS } from "@/lib/sections";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-ocid="site.footer"
      className="border-t border-border bg-card/60"
    >
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-lg text-foreground">
              El Charro Negro
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Recopilación editorial de la leyenda que cabalga los caminos de
              México desde hace más de un siglo.
            </p>
          </div>

          <nav aria-label="Apartados de la leyenda">
            <p className="text-kicker text-muted-foreground">Apartados</p>
            <ul className="mt-4 flex flex-col gap-3">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    data-ocid={`footer.${section.id}.link`}
                    className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-smooth hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span className="font-mono text-xs text-ember">
                      {section.index}
                    </span>
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {year} El Charro Negro — Leyenda de dominio popular.
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              window.location.hostname,
            )}`}
            target="_blank"
            rel="noreferrer"
            data-ocid="footer.attribution_link"
            className="text-xs text-muted-foreground transition-smooth hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            © {year}. Built with love using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
