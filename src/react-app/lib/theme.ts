// The light/dark choice is a `theme` cookie on .mehmetcinar.com, shared with the Site and every
// other app on a subdomain. The inline script in index.html applies it before the first paint.
export type Theme = "light" | "dark";

export function currentTheme(): Theme {
	return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function setTheme(theme: Theme) {
	const root = document.documentElement;
	root.classList.toggle("dark", theme === "dark");
	root.dataset.theme = theme;
	const domain = location.hostname.endsWith("mehmetcinar.com") ? "; Domain=mehmetcinar.com" : "";
	document.cookie = `theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax; Secure${domain}`;
}

// Like the Site: a change of the system setting becomes the new choice.
export function followSystemChanges(onChange: (theme: Theme) => void) {
	const query = window.matchMedia("(prefers-color-scheme: dark)");
	const listener = ({ matches }: MediaQueryListEvent) => {
		const theme = matches ? "dark" : "light";
		setTheme(theme);
		onChange(theme);
	};
	query.addEventListener("change", listener);
	return () => query.removeEventListener("change", listener);
}
