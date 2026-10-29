import { useState } from "react";
import type { Course, LearningPath } from "../../content/schema";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress as Bar } from "@/components/ui/progress";
import { CourseDialog } from "@/components/course-dialog";
import { useProgress, type SaveStatus } from "@/lib/progress";
import { courseStats, pathStats, stageStats } from "@/lib/stats";

const STATUS_TEXT: Record<SaveStatus, string> = {
	idle: "",
	saving: "Saving…",
	saved: "Saved",
	refused: "Not saved – the edit token was refused",
	failed: "Not saved – check your connection",
};

export function PathPage({
	path,
	token,
	onRefused,
}: {
	path: LearningPath;
	token: string | null;
	onRefused: () => void;
}) {
	const { progress, status, togglePart, setParts, toggleCheckpoint } = useProgress(path.slug, token, onRefused);
	const [openCourse, setOpenCourse] = useState<Course | null>(null);
	const stats = pathStats(path, progress);
	const editing = !!token;

	return (
		<section className="grid gap-10">
			<div className="grid gap-3">
				<h1 className="text-2xl font-bold text-balance sm:text-3xl">{path.title}</h1>
				<p className="max-w-prose text-muted-foreground">{path.description}</p>
				<div className="grid gap-2 pt-2">
					<Bar value={stats.percent} className="h-1.5" aria-label={`${stats.percent}% complete`} />
					<p className="flex flex-wrap justify-between gap-2 text-sm text-muted-foreground tabular-nums">
						<span>
							{stats.percent}% · {stats.parts.done}/{stats.parts.total} parts · {stats.stagesDone}/
							{path.stages.length} stages
						</span>
						<span aria-live="polite">{STATUS_TEXT[status]}</span>
					</p>
				</div>
			</div>

			<ol className="grid gap-10">
				{path.stages.map((stage, index) => {
					const s = stageStats(stage, progress);
					const isCurrent = stats.current?.id === stage.id;
					return (
						<li key={stage.id} className="grid gap-4">
							<div className="grid gap-1">
								<div className="flex items-center gap-3 text-sm text-muted-foreground">
									<span className="tabular-nums">Stage {index + 1}</span>
									{isCurrent && <Badge variant="outline">Current</Badge>}
									{s.complete && <Badge variant="secondary">Done</Badge>}
									<span className="ml-auto tabular-nums">
										{s.coursesDone}/{s.coursesTotal} courses
									</span>
								</div>
								<h2 className="text-2xl font-semibold tracking-wide text-balance">{stage.title}</h2>
								<p className="text-muted-foreground">{stage.summary}</p>
							</div>

							<ul className="grid gap-2">
								{stage.courses.map((course) => {
									const c = courseStats(course, progress);
									return (
										<li key={course.id}>
											<button
												type="button"
												onClick={() => setOpenCourse(course)}
												className="grid w-full gap-2 rounded-lg border p-4 text-left transition-colors hover:border-foreground/30 focus-visible:outline-2 focus-visible:outline-ring"
											>
												<span className="flex items-baseline justify-between gap-4">
													<span dir="auto" className="text-lg font-medium">
														{course.title}
													</span>
													<span className="shrink-0 text-sm tabular-nums text-muted-foreground">
														{c.complete ? "Done" : `${c.done}/${c.total}`}
													</span>
												</span>
												<span className="text-sm text-muted-foreground">
													{[course.publisher, course.note].filter(Boolean).join(" · ")}
												</span>
												<Bar value={c.total ? (c.done / c.total) * 100 : 0} className="h-1" />
											</button>
										</li>
									);
								})}
							</ul>

							<label className="flex items-start gap-3 rounded-lg bg-muted p-4">
								<Checkbox
									id={`checkpoint-${stage.id}`}
									className="mt-0.5"
									checked={s.checkpoint}
									disabled={!editing}
									onCheckedChange={() => toggleCheckpoint(stage.id)}
								/>
								<span>
									<span className="block text-sm font-medium uppercase tracking-wide text-muted-foreground">
										Checkpoint
									</span>
									{stage.checkpoint}
								</span>
							</label>

							{stage.extras.length > 0 && (
								<details>
									<summary className="cursor-pointer text-sm text-muted-foreground">
										Also good · {stage.extras.length}
									</summary>
									<ul className="mt-2 grid gap-1 pl-4">
										{stage.extras.map((x) => (
											<li key={x.url} className="text-muted-foreground">
												<a
													className="text-foreground underline underline-offset-4 hover:text-primary"
													href={x.url}
													target="_blank"
													rel="noopener"
													dir="auto"
												>
													{x.title}
												</a>
												{x.note && ` – ${x.note}`}
											</li>
										))}
									</ul>
								</details>
							)}
						</li>
					);
				})}
			</ol>

			{path.references.length > 0 && (
				<section className="grid gap-3 border-t pt-8">
					<h2 className="text-2xl font-semibold tracking-wide">Keep at hand</h2>
					<ul className="grid gap-1">
						{path.references.map((r) => (
							<li key={r.url} className="text-muted-foreground">
								<a
									className="text-foreground underline underline-offset-4 hover:text-primary"
									href={r.url}
									target="_blank"
									rel="noopener"
									dir="auto"
								>
									{r.title}
								</a>
								{r.note && ` – ${r.note}`}
							</li>
						))}
					</ul>
				</section>
			)}

			<CourseDialog
				course={openCourse}
				progress={progress}
				editing={editing}
				onClose={() => setOpenCourse(null)}
				onTogglePart={togglePart}
				onSetParts={setParts}
			/>
		</section>
	);
}
