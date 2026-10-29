import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Layout({
	children,
	editing,
	onEdit,
}: {
	children: ReactNode;
	editing: boolean;
	onEdit: () => void;
}) {
	return (
		<div className="mx-auto flex min-h-svh max-w-3xl flex-col px-4">
			<header className="flex items-center justify-between gap-4 border-b py-5">
				<nav className="flex items-center gap-2" aria-label="Site">
					<a className="text-xl font-semibold hover:text-primary sm:text-2xl" href="https://mehmetcinar.com">
						Mehmet Cinar
					</a>
					<span className="text-muted-foreground" aria-hidden="true">
						/
					</span>
					<a className="font-medium hover:text-primary" href="/">
						Learning
					</a>
				</nav>
				<div className="flex items-center gap-3">
					{editing && <span className="text-sm text-muted-foreground">Editing</span>}
					<ThemeToggle />
				</div>
			</header>
			<main className="flex-1 py-10">{children}</main>
			<footer className="flex flex-wrap items-center justify-between gap-4 border-t py-6 text-sm text-muted-foreground">
				<span>
					Progress through external courses, tracked in public.{" "}
					<a
						className="underline underline-offset-4 hover:text-primary"
						href="https://github.com/mcinarpro/learn.mehmetcinar.com"
					>
						Source
					</a>
				</span>
				<button type="button" className="underline underline-offset-4 hover:text-primary" onClick={onEdit}>
					{editing ? "Stop editing" : "Edit"}
				</button>
			</footer>
		</div>
	);
}
