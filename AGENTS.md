# learn.mehmetcinar.com – instructions for agents

Mehmet Cinar's public tracker of his Learning Paths: what he learns, from which external
Courses, and how far he has got. One person ticks, everyone reads. A React app and a Hono API
in one Cloudflare Worker, with bun.

## Start here

1. `GLOSSARY.md`: the app's language. Use its terms in code, content, issues and commits.
2. `DESIGN.md`: the visual system. Read it before any change to a page or a component.

## Map

| Path                         | What it is                                                     |
| ---------------------------- | -------------------------------------------------------------- |
| `content/<slug>.yaml`        | One Learning Path: Stages, Courses, Parts, Checkpoints         |
| `src/content/schema.ts`      | The Zod schema every content file must match                   |
| `src/content/progress.ts`    | The Progress shape, shared by the app and the API              |
| `src/worker/index.ts`        | `GET` / `PUT /api/progress/:slug`, KV binding `PROGRESS`       |
| `src/react-app/`             | The pages; shadcn components in `components/ui/`               |
| `scripts/check-content.ts`   | Validates every content file; `build` runs it first            |
| `.claude/skills/add-course/` | Adds a Course to a Learning Path from its URL                  |

## Commands

```bash
bun install
bun run dev             # http://localhost:5173, Worker and KV run locally
bun run build           # content check, tsc, vite build
bun run lint
bun run check:content   # content check alone
```

Local edits need `EDIT_TOKEN` in `.dev.vars` (gitignored). Production reads it from a Worker
secret.

## Rules

- **Everything written in the repo is in English**: code, comments, commits. Course and Part
  titles keep the language of their source.
- **Content lives in `content/*.yaml`.** A new Learning Path is a new file whose name is its
  `slug`; nothing else needs to change.
- **Ids are stored in Progress, so an id is never renamed or reused once it exists.** Fix a
  title freely; keep its id. Removing a Part is fine – the API drops unknown ids.
- **Never invent a Course's structure.** Parts come from the source itself (playlist entries,
  a PDF's contents, a page's headings). If a source cannot be read, say so.
- **No secret in the repo.** The edit token stays in `.dev.vars` and the Worker secret.
- **bun is the package manager.** Never add another lockfile.
- **Commits follow Conventional Commits.** Agents propose the message; Mehmet commits and
  pushes. Never commit or push unasked.
