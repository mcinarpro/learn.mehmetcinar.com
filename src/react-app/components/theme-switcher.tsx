import { useEffect, useState } from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { readChoice, setChoice, watchSystem, type ThemeChoice } from "@/lib/theme";

// Geist's Light / System / Dark control, small size, for the footer.
const OPTIONS = [
	{ value: "light", label: "Light theme", Icon: SunIcon },
	{ value: "system", label: "System theme", Icon: MonitorIcon },
	{ value: "dark", label: "Dark theme", Icon: MoonIcon },
] as const;

export function ThemeSwitcher() {
	const [choice, setState] = useState<ThemeChoice>(readChoice);
	// The cookie always holds the current choice, so the OS listener reads it directly.
	useEffect(() => watchSystem(readChoice), []);

	return (
		<div role="radiogroup" aria-label="Theme" className="inline-flex gap-0.5 rounded-full border p-0.5">
			{OPTIONS.map(({ value, label, Icon }) => (
				<button
					key={value}
					type="button"
					role="radio"
					aria-checked={choice === value}
					aria-label={label}
					title={label}
					onClick={() => {
						setChoice(value);
						setState(value);
					}}
					className={`grid size-7 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-ring ${
						choice === value ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
					}`}
				>
					<Icon className="size-4" aria-hidden="true" />
				</button>
			))}
		</div>
	);
}
