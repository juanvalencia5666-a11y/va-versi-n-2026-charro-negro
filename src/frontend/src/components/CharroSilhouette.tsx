interface CharroSilhouetteProps {
  className?: string;
  title?: string;
}

/**
 * Monochrome silhouette of the Charro Negro on horseback.
 * Pure inline SVG so it scales crisply and inherits the monochrome palette.
 */
export function CharroSilhouette({
  className,
  title = "Silueta del Charro Negro a caballo",
}: CharroSilhouetteProps) {
  return (
    <svg
      viewBox="0 0 420 360"
      role="img"
      aria-label={title}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <defs>
        <linearGradient id="charro-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.28 0.006 285)" />
          <stop offset="100%" stopColor="oklch(0.09 0.004 285)" />
        </linearGradient>
        <radialGradient id="charro-glow" cx="50%" cy="45%" r="55%">
          <stop
            offset="0%"
            stopColor="oklch(0.72 0.004 285)"
            stopOpacity="0.22"
          />
          <stop
            offset="100%"
            stopColor="oklch(0.72 0.004 285)"
            stopOpacity="0"
          />
        </radialGradient>
      </defs>

      {/* Soft glow behind the rider */}
      <ellipse cx="210" cy="170" rx="190" ry="160" fill="url(#charro-glow)" />

      {/* Ground mist */}
      <ellipse
        cx="210"
        cy="322"
        rx="180"
        ry="26"
        fill="oklch(0.72 0.004 285)"
        opacity="0.06"
      />

      <g fill="url(#charro-body)">
        {/* Horse body */}
        <path d="M96 250c-6-16 2-34 20-42 14-6 30-8 46-6l30 4c18 2 34 10 44 24 8 11 12 24 12 38 0 6-4 10-10 10h-14c-5 0-9-4-9-9 0-9-4-17-11-22-6-4-14-6-22-5l-40 4c-9 1-16 6-20 14-3 6-4 12-3 18 1 5-3 10-8 10h-8c-6 0-10-4-10-10 0-10 1-19 3-28Z" />
        {/* Horse neck + head */}
        <path d="M232 236c8-14 20-24 34-30l26-10c6-2 12 1 14 7l4 12c2 6-1 12-7 14l-20 8c-8 3-14 9-17 17l-6 16c-2 5-8 8-13 6l-10-4c-5-2-8-8-6-13l1-3c-2-7-2-14 0-20Z" />
        {/* Horse legs */}
        <path d="M120 268h16l6 52c1 5-3 9-8 9h-4c-5 0-9-4-9-9l-1-52Z" />
        <path d="M158 268h16l4 52c0 5-4 9-9 9h-4c-5 0-9-4-9-9l2-52Z" />
        <path d="M236 268h16l8 52c1 5-3 9-8 9h-4c-5 0-9-4-9-9l-3-52Z" />
        <path d="M272 268h16l6 52c1 5-3 9-8 9h-4c-5 0-9-4-9-9l-1-52Z" />
        {/* Tail */}
        <path d="M92 244c-14 6-24 18-26 32-1 6 4 11 10 10 5-1 8-5 8-10 1-9 6-17 14-22l-6-10Z" />

        {/* Rider torso */}
        <path d="M186 150c-4-14 4-28 18-32l14-4c14-4 28 4 32 18l6 22c2 8-2 16-10 18l-30 8c-8 2-16-2-18-10l-12-20Z" />
        {/* Rider legs */}
        <path d="M196 190c-2 12 2 24 12 30l14 8c5 3 11 1 13-4 2-5 0-11-5-13l-12-7c-4-2-6-6-5-11l2-10-19 7Z" />
        {/* Rider head */}
        <circle cx="222" cy="112" r="16" />
        {/* Wide-brimmed sombrero */}
        <path d="M186 106c0-4 3-7 7-7h58c4 0 7 3 7 7 0 3-2 5-5 6l-24 5c-2 0-4 0-6 0l-24-5c-3-1-5-3-5-6Z" />
        <path d="M204 100c0-9 7-16 16-16s16 7 16 16v4h-32v-4Z" />
        {/* Rider arm / rein */}
        <path d="M244 168c10 2 18 8 22 17l6 14c2 5-1 11-6 13-5 2-11-1-13-6l-5-12c-2-4-5-7-9-8l5-18Z" />
      </g>

      {/* Ember accent — the charro's gaze */}
      <circle
        cx="228"
        cy="110"
        r="2.4"
        fill="oklch(0.52 0.16 28)"
        opacity="0.9"
      />
    </svg>
  );
}
