import { partIds, type Progress } from "../../content/progress";
import type { Course, LearningPath, Stage } from "../../content/schema";

export type Tally = { done: number; total: number };

export type CourseStats = Tally & { optionalDone: number; optionalTotal: number; complete: boolean };

// Optional Parts are shown and can be ticked, but never count towards completion.
export function courseStats(course: Course, progress: Progress): CourseStats {
	const optional = new Set(course.parts.filter((p) => p.optional).map((p) => p.id));
	const ids = partIds(course);
	const required = ids.filter((id) => !optional.has(id));
	const done = required.filter((id) => progress.parts[id]).length;
	const optionalDone = [...optional].filter((id) => progress.parts[id]).length;
	return {
		done,
		total: required.length,
		optionalDone,
		optionalTotal: optional.size,
		complete: required.length > 0 ? done === required.length : optionalDone === optional.size,
	};
}

export function stageStats(stage: Stage, progress: Progress) {
	const courses = stage.courses.map((c) => courseStats(c, progress));
	const coursesDone = courses.filter((c) => c.complete).length;
	const checkpoint = !!progress.checkpoints[stage.id];
	return {
		coursesDone,
		coursesTotal: courses.length,
		parts: sum(courses),
		checkpoint,
		complete: coursesDone === courses.length && checkpoint,
	};
}

export function pathStats(path: LearningPath, progress: Progress) {
	const stages = path.stages.map((s) => stageStats(s, progress));
	const parts = sum(stages.map((s) => s.parts));
	const checkpoints = stages.filter((s) => s.checkpoint).length;
	const units = parts.total + stages.length;
	const current = path.stages.find((_, i) => !stages[i].complete);
	return {
		parts,
		checkpoints,
		stagesDone: stages.filter((s) => s.complete).length,
		percent: units ? Math.round(((parts.done + checkpoints) / units) * 100) : 0,
		current,
	};
}

function sum(tallies: Tally[]): Tally {
	return tallies.reduce((a, t) => ({ done: a.done + t.done, total: a.total + t.total }), { done: 0, total: 0 });
}
