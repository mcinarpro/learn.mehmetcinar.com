import type { ReactNode } from "react";

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
			<header className="flex items-center justify-between gap-4 border-b py-5 text-sm">
				<nav className="flex items-center gap-2" aria-label="Site">
					<a className="font-semibold hover:text-primary" href="https://mehmetcinar.com">
						Mehmet Cinar
					</a>
					<span className="text-muted-foreground" aria-hidden="true">
						/
					</span>
					<a className="hover:text-primary" href="/">
						Learning
					</a>
				</nav>
				{editing && <span className="text-xs text-muted-foreground">Editing</span>}
			</header>
			<main className="flex-1 py-10">{children}</main>
			<footer className="flex flex-wrap items-center justify-between gap-4 border-t py-6 text-xs text-muted-foreground">
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
