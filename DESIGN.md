# DESIGN.md

The visual system of learn.mehmetcinar.com. It is the same as mehmetcinar.com's, so the two
read as one site. The source of truth is `src/react-app/index.css`.

The colour language follows Vercel's [Geist](https://vercel.com/geist): an achromatic chrome and
a single blue. Components come from [shadcn/ui](https://ui.shadcn.com) (style `radix-nova`).

## The rule above all others

**The chrome is achromatic; a saturated colour always signals something.** Every grey has a
chroma of 0. Blue marks what you can act on – links, focus, checked boxes, the primary button –
and nothing else. Progress bars are not actions: they use `foreground`, never blue.

## Tokens

shadcn's variables carry the Site's values. Light values sit on `:root`, dark values on
`.dark`. The light/dark choice is the `theme` cookie on `.mehmetcinar.com`, shared with the Site
(ADR 0002 in the Site repo): the inline script in `index.html` applies it before the first
paint, or the system setting when there is no cookie, and the header toggle writes it.

| Token                       | Role                               | Light                   | Dark                   |
| --------------------------- | ---------------------------------- | ----------------------- | ---------------------- |
| `background`, `card`        | page, cards                        | `oklch(1 0 0)`          | `oklch(0.145 0 0)`     |
| `foreground`                | text, icons, progress bars         | `oklch(0.2 0 0)`        | `oklch(0.985 0 0)`     |
| `primary`, `ring`           | the only hue – actions and focus   | `oklch(0.55 0.222 259)` | `oklch(0.7 0.222 259)` |
| `primary-foreground`        | text on a blue fill                | `oklch(1 0 0)`          | `oklch(0.145 0 0)`     |
| `muted`, `secondary`, `accent` | subtle fills, hover             | `oklch(0.97 0 0)`       | `oklch(0.24 0 0)`      |
| `muted-foreground`          | secondary text                     | `oklch(0.51 0 0)`       | `oklch(0.76 0 0)`      |
| `border`, `input`           | hairlines                          | `oklch(0.922 0 0)`      | `oklch(0.325 0 0)`     |

shadcn's `accent` is a hover fill, not the Site's accent: the blue is `primary`.

## Typography

**Google Sans Code** for everything, loaded from Google Fonts in `index.html`. Titles of
Courses and Parts carry `dir="auto"`, so a right-to-left title (Arabic) lays out correctly.

## Never

- A colour outside the tokens, or a hard-coded colour in a component.
- Blue on something that cannot be clicked.
- A second typeface.
- A card around everything: a bordered, divided list marks Courses and Learning Paths, nothing else.
