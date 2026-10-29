import { Hono } from "hono";
import { learningPathBySlug } from "../content";
import { emptyProgress, knownIds, progressSchema } from "../content/progress";

const MAX_BODY_BYTES = 64 * 1024;

const app = new Hono<{ Bindings: Env }>();

const key = (slug: string) => `progress:${slug}`;

// Compares digests so the check takes the same time whatever the token.
async function authorized(header: string | undefined, token: string | undefined) {
	if (!token || !header?.startsWith("Bearer ")) return false;
	const encoder = new TextEncoder();
	const [given, expected] = await Promise.all(
		[header.slice("Bearer ".length), token].map((value) => crypto.subtle.digest("SHA-256", encoder.encode(value))),
	);
	return crypto.subtle.timingSafeEqual(given, expected);
}

app.get("/api/progress/:slug", async (c) => {
	const slug = c.req.param("slug");
	if (!learningPathBySlug.has(slug)) return c.json({ error: "Unknown Learning Path" }, 404);
	const stored = await c.env.PROGRESS.get(key(slug), "json");
	return c.json(stored ?? emptyProgress, 200, { "Cache-Control": "no-store" });
});

app.put("/api/progress/:slug", async (c) => {
	if (!(await authorized(c.req.header("Authorization"), c.env.EDIT_TOKEN))) {
		return c.json({ error: "Missing or wrong edit token" }, 401);
	}
	const slug = c.req.param("slug");
	const path = learningPathBySlug.get(slug);
	if (!path) return c.json({ error: "Unknown Learning Path" }, 404);

	const raw = await c.req.text();
	if (raw.length > MAX_BODY_BYTES) return c.json({ error: "Progress is too large" }, 413);
	let body: unknown;
	try {
		body = JSON.parse(raw);
	} catch {
		return c.json({ error: "Progress must be JSON" }, 400);
	}
	const parsed = progressSchema.safeParse(body);
	if (!parsed.success) return c.json({ error: "Progress does not match the expected shape" }, 400);

	// Ids removed from the content since the page loaded are dropped, not rejected.
	const ids = knownIds(path);
	const progress = {
		parts: Object.fromEntries(Object.keys(parsed.data.parts).filter((id) => ids.parts.has(id)).map((id) => [id, true])),
		checkpoints: Object.fromEntries(
			Object.keys(parsed.data.checkpoints).filter((id) => ids.stages.has(id)).map((id) => [id, true]),
		),
		updatedAt: new Date().toISOString(),
	};
	await c.env.PROGRESS.put(key(slug), JSON.stringify(progress));
	return c.json(progress);
});

export default app;
