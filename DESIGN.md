# Design Brief

## Direction

Noche del Charro — a gothic-editorial horror showcase for the Charro Negro legend, presented like a museum exhibit with a professional Halloween finish.

## Tone

Refined editorial horror: strictly black and grey, cinematic and restrained, never cheap or cartoonish — the fear comes from negative space, mist and a single ember accent.

## Differentiation

A monochrome ink-engraving silhouette of the Charro on horseback emerging from drifting fog, framed by hairline rules and mono timeline ticks — a legend presented as an artifact, not a spookhouse.

## Color Palette

| Token      | OKLCH        | Role                                              |
| ---------- | ------------ | ------------------------------------------------- |
| background | 0.11 0.004 285 | Deep near-black page base                       |
| foreground | 0.93 0.004 285 | Bone/silver primary text                        |
| card       | 0.155 0.005 285 | Layered charcoal surface                        |
| primary    | 0.9 0.004 285  | Bone-white emphasis, buttons, active states     |
| accent     | 0.52 0.16 28   | Restrained ember/blood red — rules, hover, focus |
| muted      | 0.2 0.005 285  | Recessed panels, inactive surfaces              |
| border     | 0.26 0.006 285 | Hairline grey dividers                          |

## Typography

- Display: Lora (serif) — hero and section headings, folkloric editorial weight
- Accent: Instrument Serif Italic — pull quotes and legend epigraphs
- Body: Satoshi — paragraphs, UI labels, card copy
- Mono: JetBrains Mono — kickers, timeline dates, index numbers
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold tracking-tight`, label `text-kicker` (mono uppercase tracked), body `text-base md:text-lg`

## Elevation & Depth

Depth comes from layered charcoal surfaces plus a soft vignette and grain, not from bright shadows; `shadow-subtle` and `shadow-elevated` stay near-black and diffuse.

## Structural Zones

| Zone    | Background              | Border             | Notes                                                        |
| ------- | ----------------------- | ------------------ | ------------------------------------------------------------ |
| Header  | `bg-background/80` blur | `border-b` hairline | Sticky nav, mono links, small emblem, ember active underline |
| Content | `bg-background`         | —                  | Alternating `bg-card` and `bg-muted/30` sections, fog layers |
| Footer  | `bg-muted/40`           | `border-t` hairline | Quiet mono copyright + right-aligned links                   |

## Spacing & Rhythm

Generous vertical rhythm (`py-20 md:py-32`) between sections, tight `gap-2`/`gap-4` within groups, and a consistent max-width editorial column with wide side margins.

## Component Patterns

- Buttons: 4px radius, bone `bg-primary` for primary actions, hairline outline for secondary, ember ring on focus, subtle lift on hover
- Cards: 4px radius, `surface-card` gradient charcoal, 1px hairline border, ember-tinted border on active/hover
- Badges: mono uppercase pill with hairline border, ember text for active section index
- Narration button: circular play control with a thin waveform and mono "narración por voz" label

## Motion

- Entrance: `animate-fade-rise` on scroll reveal, 0.7s `cubic-bezier(0.22,1,0.36,1)`
- Hover: `transition-smooth` 0.3s lift and ember border/underline on cards and links
- Decorative: `animate-mist-drift` fog drift, `animate-ember-pulse` on the accent rule

## Constraints

- Strictly black and grey palette; a single ember accent used sparingly
- Dark mode only — no user-togglable light/dark switch
- No neon glow, no purple gradients, no raw color literals in components
- Body text must keep AA+ contrast (min 4.5:1) against charcoal surfaces

## Signature Detail

An ink-engraving Charro-on-horseback silhouette dissolving into drifting mist behind the hero headline — the legend's icon treated as a museum artifact.
