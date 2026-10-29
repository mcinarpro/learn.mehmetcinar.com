import { parseLearningPath, type LearningPath } from "./schema";

const files = import.meta.glob<string>("/content/*.yaml", {
	eager: true,
	query: "?raw",
	import: "default",
});

export const learningPaths: LearningPath[] = Object.entries(files)
	.map(([file, source]) => parseLearningPath(source, file))
	.sort((a, b) => a.title.localeCompare(b.title));

export const learningPathBySlug = new Map(learningPaths.map((p) => [p.slug, p]));
