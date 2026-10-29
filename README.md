# learn.mehmetcinar.com

What I am learning, from which courses, and how far I have got – tracked in public at
[learn.mehmetcinar.com](https://learn.mehmetcinar.com).

Each Learning Path lists external courses (playlists, PDFs, online courses) split into the
parts I tick as I go: one video, one chapter, one section. Anyone can read it; only I can tick.

## Stack

- React, Vite and TypeScript, with Tailwind and shadcn/ui
- One Cloudflare Worker: the static app and a small Hono API
- Progress in Workers KV; content in YAML files, validated with Zod
- bun

## Run it

```bash
bun install
echo "EDIT_TOKEN=$(openssl rand -hex 32)" > .dev.vars
bun run dev
```

Add a Learning Path by adding `content/<slug>.yaml`; the schema is in `src/content/schema.ts`.

Started from Cloudflare's [vite-react-template](https://github.com/cloudflare/templates/tree/main/vite-react-template).
