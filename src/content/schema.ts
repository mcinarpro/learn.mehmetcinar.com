import { parse } from "yaml";
import { z } from "zod";

// Ids are stored in Progress, so once a Part is ticked its id must never change.
const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "ids are lowercase slugs");
const text = z.string().min(1);

const link = z.object({
	title: text,
	url: z.url(),
	note: z.string().optional(),
});

const part = z.object({
	id,
	title: text,
	url: z.url().optional(),
	note: z.string().optional(),
	optional: z.boolean().optional(),
});

const course = z.object({
	id,
	title: text,
	url: z.url().optional(),
	publisher: text,
	kind: z.enum(["playlist", "video", "pdf", "course", "web", "manual", "task"]),
	note: z.string().optional(),
	summary: z.string().optional(),
	duration: z.string().optional(),
	parts: z.array(part).default([]),
});

const stage = z.object({
	id,
	title: text,
	summary: text,
	checkpoint: text,
	courses: z.array(course).min(1),
	extras: z.array(link).default([]),
});

export const learningPathSchema = z
	.object({
		slug: id,
		title: text,
		description: text,
		lang: z.string().default("en"),
		stages: z.array(stage).min(1),
		references: z.array(link).default([]),
	})
	.superRefine((path, ctx) => {
		// Stage ids key the Checkpoints; Course and Part ids key the Parts.
		const seen = new Set<string>();
		const ids = path.stages.flatMap((s) => [
			`stage:${s.id}`,
			...s.courses.flatMap((c) => [c.id, ...c.parts.map((p) => p.id)]),
		]);
		for (const value of ids) {
			if (seen.has(value)) ctx.addIssue({ code: "custom", message: `duplicate id: ${value}` });
			seen.add(value);
		}
	});

export type LearningPath = z.infer<typeof learningPathSchema>;
export type Stage = LearningPath["stages"][number];
export type Course = Stage["courses"][number];
export type Part = Course["parts"][number];

export function parseLearningPath(source: string, file: string): LearningPath {
	const result = learningPathSchema.safeParse(parse(source));
	if (!result.success) throw new Error(`${file}: ${z.prettifyError(result.error)}`);
	const slug = file.split("/").pop()?.replace(/\.yaml$/, "");
	if (result.data.slug !== slug) throw new Error(`${file}: slug "${result.data.slug}" must match the file name`);
	return result.data;
}
