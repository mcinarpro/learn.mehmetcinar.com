// The reader's light/dark choice is a `theme` cookie on .mehmetcinar.com, shared with the Site
// and every other app on a subdomain (ADR 0002 in the Site repo). No cookie means "system".
// The inline script in index.html applies it before the first paint.
export type ThemeChoice = "light" | "system" | "dark";

const system = () => window.matchMedia("(prefers-color-scheme: dark)");

export function readChoice(): ThemeChoice {
	const value = document.cookie.match(/(?:^|; )theme=(light|dark|system)/)?.[1];
	return (value as ThemeChoice | undefined) ?? "system";
}

export function applyChoice(choice: ThemeChoice) {
	const dark = choice === "dark" || (choice === "system" && system().matches);
	const root = document.documentElement;
	root.classList.toggle("dark", dark);
	root.dataset.theme = dark ? "dark" : "light";
}

// Written only when the reader picks an option.
export function setChoice(choice: ThemeChoice) {
	const domain = location.hostname.endsWith("mehmetcinar.com") ? "; Domain=mehmetcinar.com" : "";
	document.cookie = `theme=${choice}; Path=/; Max-Age=31536000; SameSite=Lax; Secure${domain}`;
	applyChoice(choice);
}

// While the choice is "system", follow the OS setting live; nothing is written.
export function watchSystem(getChoice: () => ThemeChoice) {
	const query = system();
	const listener = () => {
		if (getChoice() === "system") applyChoice("system");
	};
	query.addEventListener("change", listener);
	return () => query.removeEventListener("change", listener);
}
