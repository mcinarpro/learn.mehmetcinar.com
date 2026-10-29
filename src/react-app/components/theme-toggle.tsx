import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { currentTheme, followSystemChanges, setTheme } from "@/lib/theme";

export function ThemeToggle() {
	const [theme, setState] = useState(currentTheme);

	useEffect(() => followSystemChanges(setState), []);

	const next = theme === "dark" ? "light" : "dark";
	return (
		<button
			type="button"
			className="grid size-8 place-items-center rounded-md hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
			aria-label={`Switch to ${next} theme`}
			onClick={() => {
				setTheme(next);
				setState(next);
			}}
		>
			{theme === "dark" ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
		</button>
	);
}
