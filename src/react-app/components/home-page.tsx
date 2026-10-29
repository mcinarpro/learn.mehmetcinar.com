import { useEffect, useState } from "react";
import { learningPaths } from "../../content";
import type { Progress } from "../../content/progress";
import type { LearningPath } from "../../content/schema";
import { Progress as Bar } from "@/components/ui/progress";
import { fetchProgress } from "@/lib/progress";
import { nextUp, pathStats } from "@/lib/stats";

// Progress per Learning Path: undefined while loading, null when it could not be read.
type Loaded = Record<string, Progress | null | undefined>;

export function HomePage() {
	const [progress, setProgress] = useState<Loaded>({});

	useEffect(() => {
		for (const path of learningPaths) {
			fetchProgress(path.slug)
				.then((p) => setProgress((all) => ({ ...all, [path.slug]: p })))
				.catch(() => setProgress((all) => ({ ...all, [path.slug]: null })));
		}
	}, []);

	return (
		<section className="grid gap-10">
			<div className="grid gap-2">
				<h1 className="text-4xl font-bold text-balance sm:text-5xl">Learning</h1>
				<p className="max-w-prose text-muted-foreground">
					What I am learning, from which courses, and how far I have got.
				</p>
			</div>

			<div className="grid">
				<div className="flex gap-4 border-b pb-3 text-sm font-medium tracking-wide text-muted-foreground uppercase">
					<span className="flex-1">Learning Path</span>
					<span className="hidden w-40 sm:block">Progress</span>
					<span className="w-12 text-right">%</span>
				</div>
				<ul className="divide-y">
					{learningPaths.map((path) => {
						const p = progress[path.slug];
						const stats = p ? pathStats(path, p) : null;
						return (
							<li key={path.slug}>
								<a
									href={`/${path.slug}/`}
									className="group flex items-center gap-4 py-4 transition-colors hover:bg-muted/50"
								>
									<span className="grid min-w-0 flex-1 gap-0.5">
										<span className="text-lg font-medium group-hover:text-primary">{path.title}</span>
										<span dir="auto" className="truncate text-sm text-muted-foreground">
											{p ? nextLabel(path, p) : p === null ? "Progress unavailable" : "Loading…"}
										</span>
									</span>
									<Bar value={stats?.percent ?? 0} className="hidden h-1.5 w-40 sm:block" />
									<span className="w-12 text-right text-sm tabular-nums text-muted-foreground">
										{stats ? `${stats.percent}%` : "–"}
									</span>
								</a>
							</li>
						);
					})}
				</ul>
			</div>
		</section>
	);
}

function nextLabel(path: LearningPath, progress: Progress) {
	const next = nextUp(path, progress);
	if (!next) return "Finished";
	return next.kind === "part" ? `Next up: ${next.partTitle}` : `Next up: the checkpoint of ${next.stage.title}`;
}
