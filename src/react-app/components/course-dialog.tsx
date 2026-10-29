import { ChevronLeftIcon, ChevronRightIcon, ExternalLinkIcon } from "lucide-react";
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
	previous,
	next,
	progress,
	editing,
	onNavigate,
	onClose,
	onTogglePart,
	onSetParts,
}: {
	course: Course | null;
	previous: Course | null;
	next: Course | null;
	progress: Progress;
	editing: boolean;
	onNavigate: (course: Course) => void;
	onClose: () => void;
	onTogglePart: (id: string) => void;
	onSetParts: (ids: string[], done: boolean) => void;
}) {
	if (!course) return null;
	const stats = courseStats(course, progress);
	const required = course.parts.length ? course.parts.filter((p) => !p.optional).map((p) => p.id) : partIds(course);

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent
				// Full screen on phones, a centred dialog from `sm` up.
				className="grid h-svh max-h-svh max-w-none grid-cols-[minmax(0,1fr)] grid-rows-[auto_auto_minmax(0,1fr)_auto] gap-4 rounded-none sm:h-auto sm:max-h-[85svh] sm:max-w-xl sm:rounded-xl"
				onKeyDown={(e) => {
					if (e.target instanceof HTMLInputElement) return;
					if (e.key === "ArrowLeft" && previous) onNavigate(previous);
					if (e.key === "ArrowRight" && next) onNavigate(next);
				}}
			>
				<DialogHeader>
					<DialogTitle dir="auto" className="pr-6 text-lg leading-snug text-balance">
						{course.title}
					</DialogTitle>
					<DialogDescription className="line-clamp-2 sm:line-clamp-none">
						{course.summary ?? course.publisher}
					</DialogDescription>
					<p className="text-sm text-muted-foreground">
						{[course.publisher, course.duration, course.note].filter(Boolean).join(" · ")}
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
					{(previous || next) && (
						<nav className="flex w-full justify-between gap-2 border-t pt-3" aria-label="Other courses">
							{previous ? (
								<Button variant="ghost" className="min-w-0 max-w-[48%] justify-start" onClick={() => onNavigate(previous)}>
									<ChevronLeftIcon />
									<span dir="auto" className="truncate">
										{previous.title}
									</span>
								</Button>
							) : (
								<span />
							)}
							{next && (
								<Button variant="ghost" className="min-w-0 max-w-[48%] justify-end" onClick={() => onNavigate(next)}>
									<span dir="auto" className="truncate">
										{next.title}
									</span>
									<ChevronRightIcon />
								</Button>
							)}
						</nav>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
