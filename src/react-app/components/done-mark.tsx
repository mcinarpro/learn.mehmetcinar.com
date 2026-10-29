import { CheckIcon } from "lucide-react";

// What visitors see instead of a checkbox: a state, not a control, so it stays achromatic.
export function DoneMark({ done, className = "" }: { done: boolean; className?: string }) {
	return (
		<span
			role="img"
			aria-label={done ? "Done" : "Not done"}
			className={`grid size-4 shrink-0 place-items-center rounded-[4px] ${
				done ? "bg-foreground text-background" : "border border-foreground/30"
			} ${className}`}
		>
			{done && <CheckIcon className="size-3" strokeWidth={3} aria-hidden="true" />}
		</span>
	);
}
