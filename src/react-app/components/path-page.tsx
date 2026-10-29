import { ChevronRightIcon } from "lucide-react";
import type { LearningPath } from "../../content/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress as Bar } from "@/components/ui/progress";
import { CourseDialog } from "@/components/course-dialog";
import { DoneMark } from "@/components/done-mark";
import { useProgress, type SaveStatus } from "@/lib/progress";
import { useOpenCourse } from "@/lib/use-open-course";
import { courseStats, nextUp, pathStats, stageStats } from "@/lib/stats";

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
	const dialog = useOpenCourse(path.stages.flatMap((s) => s.courses));
	const stats = pathStats(path, progress);
	const next = nextUp(path, progress);
	const editing = !!token;

	return (
		<section className="grid gap-10">
			<div className="grid gap-3">
				<h1 className="text-2xl font-bold text-balance sm:text-3xl">{path.title}</h1>
				<p className="max-w-prose text-muted-foreground">{path.description}</p>
			</div>

			<div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
				<aside className="grid content-start gap-8 lg:sticky lg:top-20 lg:order-last lg:max-h-[calc(100svh-6rem)] lg:self-start lg:overflow-y-auto lg:pr-2 lg:pb-4 lg:[scrollbar-width:thin]">
					<div className="grid gap-2">
						<SideLabel>Next up</SideLabel>
						{next?.kind === "part" && (
							<button
								type="button"
								onClick={() => dialog.open(next.course)}
								className="grid gap-0.5 text-left text-primary underline-offset-4 hover:underline"
							>
								<span dir="auto" className="font-medium">
									{next.partTitle}
								</span>
								<span dir="auto" className="text-sm text-muted-foreground">
									{next.partNumber ? `Part ${next.partNumber} of ${next.course.title}` : next.course.publisher}
								</span>
							</button>
						)}
						{next?.kind === "checkpoint" && (
							<a href={`#stage-${next.stage.id}`} className="font-medium text-primary underline-offset-4 hover:underline">
								Checkpoint of {next.stage.title}
							</a>
						)}
						{!next && <p className="font-medium">Learning Path finished</p>}
					</div>

					<div className="grid gap-2">
						<SideLabel>Progress</SideLabel>
						<p className="text-3xl font-semibold tabular-nums">{stats.percent}%</p>
						<Bar value={stats.percent} className="h-1.5" aria-label={`${stats.percent}% complete`} />
						<p className="text-sm text-muted-foreground tabular-nums">
							{stats.parts.done}/{stats.parts.total} parts · {stats.stagesDone}/{path.stages.length} stages
						</p>
						{status !== "idle" && (
							<p className="text-sm text-muted-foreground" aria-live="polite">
								{STATUS_TEXT[status]}
							</p>
						)}
					</div>

					<nav className="grid gap-2" aria-label="Stages">
						<SideLabel>Stages</SideLabel>
						<ol className="grid gap-1">
							{path.stages.map((stage, index) => {
								const s = stageStats(stage, progress);
								const isCurrent = stats.current?.id === stage.id;
								return (
									<li key={stage.id}>
										<a
											href={`#stage-${stage.id}`}
											className={`flex items-baseline gap-2 py-1 hover:text-primary ${isCurrent ? "font-medium text-foreground" : "text-muted-foreground"}`}
										>
											<span className="tabular-nums">{index + 1}.</span>
											<span className="min-w-0 flex-1">{stage.title}</span>
											<span className="text-sm tabular-nums">
												{s.parts.done}/{s.parts.total}
											</span>
										</a>
									</li>
								);
							})}
						</ol>
					</nav>

					{path.references.length > 0 && (
						<details>
							<summary className="cursor-pointer text-sm font-medium tracking-wide text-muted-foreground uppercase">
								Keep at hand · {path.references.length}
							</summary>
							<div className="mt-3">
								<References links={path.references} />
							</div>
						</details>
					)}
				</aside>

				<ol className="grid gap-16">
				{path.stages.map((stage, index) => {
					const s = stageStats(stage, progress);
					const isCurrent = stats.current?.id === stage.id;
					return (
						<li key={stage.id} id={`stage-${stage.id}`} className="grid gap-4">
							<div className="grid gap-3">
								<div className="flex items-baseline gap-3 border-b pb-3 text-sm font-medium tracking-wide text-muted-foreground uppercase">
									<span>
										Stage {index + 1}
										{isCurrent && <span className="text-foreground"> · Current</span>}
										{s.complete && <span className="text-foreground"> · Done</span>}
									</span>
									<span className="ml-auto tabular-nums normal-case">
										{s.parts.done}/{s.parts.total} parts
									</span>
								</div>
								<h2 className="text-2xl font-semibold tracking-wide text-balance">{stage.title}</h2>
								<p className="text-muted-foreground">{stage.summary}</p>
								{s.parts.done > 0 && <Bar value={(s.parts.done / s.parts.total) * 100} className="h-1" />}
								<label className="flex items-start gap-3 text-sm">
									{editing ? (
										<Checkbox
											id={`checkpoint-${stage.id}`}
											className="mt-0.5"
											checked={s.checkpoint}
											onCheckedChange={() => toggleCheckpoint(stage.id)}
										/>
									) : (
										<DoneMark done={s.checkpoint} className="mt-0.5" />
									)}
									<span>
										<span className="font-medium tracking-wide text-muted-foreground uppercase">Checkpoint · </span>
										{stage.checkpoint}
									</span>
								</label>
							</div>

							<ul className="divide-y rounded-lg border">
								{stage.courses.map((course) => {
									const c = courseStats(course, progress);
									return (
										<li key={course.id}>
											<button
												type="button"
												onClick={() => dialog.open(course)}
												className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 text-left transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-ring"
											>
												<span className="grid gap-0.5">
													<span dir="auto" className="text-lg font-medium group-hover:text-primary">
														{course.title}
													</span>
													<span className="text-sm text-muted-foreground">
														{[course.publisher, course.note].filter(Boolean).join(" · ")}
													</span>
												</span>
												<span className="flex items-center gap-3">
													{c.done > 0 && !c.complete && (
														<Bar value={(c.done / c.total) * 100} className="hidden h-1 w-20 sm:block" />
													)}
													<span className="text-sm tabular-nums text-muted-foreground">
														{c.complete ? "Done" : `${c.done}/${c.total}`}
													</span>
													<ChevronRightIcon className="size-4 text-muted-foreground" aria-hidden="true" />
												</span>
											</button>
										</li>
									);
								})}
							</ul>


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

			</div>

			<CourseDialog
				course={dialog.course}
				previous={dialog.previous}
				next={dialog.next}
				progress={progress}
				editing={editing}
				onNavigate={dialog.open}
				onClose={dialog.close}
				onTogglePart={togglePart}
				onSetParts={setParts}
			/>
		</section>
	);
}

function SideLabel({ children }: { children: string }) {
	return <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">{children}</h2>;
}

function References({ links }: { links: LearningPath["references"] }) {
	return (
		<ul className="grid gap-2 text-sm">
			{links.map((r) => (
				<li key={r.url}>
					<a className="underline-offset-4 hover:text-primary hover:underline" href={r.url} target="_blank" rel="noopener" dir="auto">
						{r.title}
					</a>
					{r.note && <span className="block text-muted-foreground">{r.note}</span>}
				</li>
			))}
		</ul>
	);
}
