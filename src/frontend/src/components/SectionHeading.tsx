import type { ReactNode } from "react";

interface SectionHeadingProps {
  index: string;
  kicker: string;
  title: string;
  description?: ReactNode;
  id?: string;
}

/**
 * Editorial section heading: numbered kicker, hairline rule, display title.
 */
export function SectionHeading({
  index,
  kicker,
  title,
  description,
  id,
}: SectionHeadingProps) {
  return (
    <header className="max-w-3xl">
      <div className="flex items-center gap-4">
        <span className="text-kicker text-muted-foreground">{kicker}</span>
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
        <span className="font-mono text-xs text-ember">{index}</span>
      </div>
      <h2
        id={id}
        className="mt-6 font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </header>
  );
}
