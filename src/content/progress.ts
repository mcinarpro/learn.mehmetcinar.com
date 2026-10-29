import { z } from "zod";
import type { Course, LearningPath } from "./schema";

// Progress of one Learning Path: done Parts by id, passed Checkpoints by Stage id.
export const progressSchema = z.object({
	parts: z.record(z.string(), z.literal(true)).default({}),
	checkpoints: z.record(z.string(), z.literal(true)).default({}),
	updatedAt: z.string().optional(),
});

export type Progress = z.infer<typeof progressSchema>;

export const emptyProgress: Progress = { parts: {}, checkpoints: {} };

// A Course without Parts counts as one Part carrying the Course's id.
export function partIds(course: Course): string[] {
	return course.parts.length ? course.parts.map((p) => p.id) : [course.id];
}

export function knownIds(path: LearningPath) {
	return {
		parts: new Set(path.stages.flatMap((s) => s.courses.flatMap(partIds))),
		stages: new Set(path.stages.map((s) => s.id)),
	};
}
