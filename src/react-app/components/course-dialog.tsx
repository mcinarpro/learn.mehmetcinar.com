import { ExternalLinkIcon } from "lucide-react";
import { partIds, type Progress } from "../../content/progress";
import type { Course } from "../../content/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DoneMark } from "@/components/done-mark";
import { Progress as Bar } from "@/components/ui/progress";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { courseStats } from "@/lib/stats";

export function CourseDialog({
	course,
	progress,
	editing,
	onClose,
	onTogglePart,
	onSetParts,
}: {
	course: Course | null;
	progress: Progress;
	editing: boolean;
	onClose: () => void;
	onTogglePart: (id: string) => void;
	onSetParts: (ids: string[], done: boolean) => void;
}) {
	if (!course) return null;
	const stats = courseStats(course, progress);
	const required = course.parts.length ? course.parts.filter((p) => !p.optional).map((p) => p.id) : partIds(course);

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="grid max-h-[85svh] grid-rows-[auto_auto_minmax(0,1fr)_auto] gap-4 sm:max-w-xl">
				<DialogHeader>
					<DialogTitle dir="auto" className="pr-6 text-balance">
						{course.title}
					</DialogTitle>
					<DialogDescription>{course.summary ?? course.publisher}</DialogDescription>
					<p className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
						{[course.publisher, course.duration, course.note].filter(Boolean).map((fact) => (
							<span key={fact}>{fact}</span>
						))}
					</p>
				</DialogHeader>

				<div className="grid gap-1.5">
					<Bar value={stats.total ? (stats.done / stats.total) * 100 : 0} className="h-1.5" />
					<p className="text-sm tabular-nums text-muted-foreground">
						{stats.done} of {stats.total} done
						{stats.optionalTotal > 0 && ` · optional ${stats.optionalDone} of ${stats.optionalTotal}`}
						{!editing && " · read only"}
					</p>
				</div>

				{course.parts.length > 0 ? (
					<ul className="-mx-1 grid content-start gap-0.5 overflow-y-auto px-1">
						{course.parts.map((part) => (
							<li key={part.id} className="flex items-start gap-3 border-b border-dashed py-2 last:border-b-0">
								{editing ? (
									<Checkbox
										id={`part-${part.id}`}
										className="mt-0.5"
										checked={!!progress.parts[part.id]}
										onCheckedChange={() => onTogglePart(part.id)}
										aria-label={`Done: ${part.title}`}
									/>
								) : (
									<DoneMark done={!!progress.parts[part.id]} className="mt-1" />
								)}
								<div className="grid min-w-0 gap-0.5">
									<span className="flex flex-wrap items-baseline gap-2">
										{part.url ? (
											<a
												dir="auto"
												className="font-medium underline-offset-4 hover:text-primary hover:underline"
												href={part.url}
												target="_blank"
												rel="noopener"
											>
												{part.title}
											</a>
										) : (
											<label dir="auto" htmlFor={`part-${part.id}`} className="font-medium">
												{part.title}
											</label>
										)}
										{part.optional && <Badge variant="outline">Optional</Badge>}
									</span>
									{part.note && <span className="text-sm text-muted-foreground">{part.note}</span>}
								</div>
							</li>
						))}
					</ul>
				) : (
					<p className="text-muted-foreground">
						This course is one unit: watch or read it, then mark it as done.
					</p>
				)}

				<DialogFooter className="flex-wrap gap-2 sm:justify-between">
					{course.url ? (
						<Button asChild>
							<a href={course.url} target="_blank" rel="noopener">
								Open the course <ExternalLinkIcon />
							</a>
						</Button>
					) : (
						<span />
					)}
					{editing && (
						<div className="flex gap-2">
							<Button variant="outline" onClick={() => onSetParts(required, !stats.complete)}>
								{stats.complete ? "Mark as not done" : course.parts.length ? "Mark all done" : "Mark as done"}
							</Button>
						</div>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
