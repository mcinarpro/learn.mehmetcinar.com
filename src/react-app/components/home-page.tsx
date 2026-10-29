import { useEffect, useState } from "react";
import { learningPaths } from "../../content";
import { emptyProgress, type Progress } from "../../content/progress";
import { Progress as Bar } from "@/components/ui/progress";
import { fetchProgress } from "@/lib/progress";
import { pathStats } from "@/lib/stats";

export function HomePage() {
	const [progress, setProgress] = useState<Record<string, Progress>>({});

	useEffect(() => {
		for (const path of learningPaths) {
			fetchProgress(path.slug)
				.then((p) => setProgress((all) => ({ ...all, [path.slug]: p })))
				.catch(() => {});
		}
	}, []);

	return (
		<section className="grid gap-8">
			<div className="grid gap-2">
				<h1 className="text-4xl font-bold text-balance sm:text-5xl">Learning</h1>
				<p className="max-w-prose text-muted-foreground">
					What I am learning, from which courses, and how far I have got.
				</p>
			</div>
			<ul className="grid gap-4">
				{learningPaths.map((path) => {
					const stats = pathStats(path, progress[path.slug] ?? emptyProgress);
					return (
						<li key={path.slug}>
							<a
								href={`/${path.slug}/`}
								className="group grid gap-3 rounded-lg border p-5 transition-colors hover:border-foreground/30"
							>
								<div className="flex items-baseline justify-between gap-4">
									<h2 className="text-lg font-medium group-hover:text-primary">{path.title}</h2>
									<span className="text-sm tabular-nums text-muted-foreground">{stats.percent}%</span>
								</div>
								<p className="text-muted-foreground">{path.description}</p>
								<Bar value={stats.percent} className="h-1.5" />
								<p className="text-sm text-muted-foreground">
									{stats.current ? `Now: ${stats.current.title}` : "Finished"} · {stats.parts.done}/
									{stats.parts.total} parts · {path.stages.length} stages
								</p>
							</a>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
