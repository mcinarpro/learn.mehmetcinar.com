import type { ReactNode } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";

// Wider than the Site's 768px column: the app has a side column and full-width lists,
// while running text stays at max-w-prose (ADR 0002 in the Site repo).
const container = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

export function Layout({
	children,
	current,
	editing,
	onEdit,
}: {
	children: ReactNode;
	current?: string;
	editing: boolean;
	onEdit: () => void;
}) {
	return (
		<div className="flex min-h-svh flex-col">
			<header className="sticky top-0 z-40 border-b bg-background">
				<div className={`${container} flex h-14 items-center justify-between gap-4`}>
					<nav aria-label="Breadcrumb" className="min-w-0">
						<ol className="flex min-w-0 items-center gap-2">
							<li>
								<a className="text-xl font-semibold whitespace-nowrap hover:text-primary sm:text-2xl" href="https://mehmetcinar.com">
									Mehmet Cinar
								</a>
							</li>
							<li aria-hidden="true" className="text-muted-foreground">
								/
							</li>
							<li>
								{current ? (
									<a className="font-medium hover:text-primary" href="/">
										Learning
									</a>
								) : (
									<span className="font-medium" aria-current="page">
										Learning
									</span>
								)}
							</li>
							{current && (
								<>
									<li aria-hidden="true" className="hidden text-muted-foreground sm:block">
										/
									</li>
									<li className="hidden min-w-0 truncate text-muted-foreground sm:block" aria-current="page">
										{current}
									</li>
								</>
							)}
						</ol>
					</nav>
					<div className="flex shrink-0 items-center gap-3">
						{editing && <span className="text-sm text-muted-foreground">Editing</span>}
					</div>
				</div>
			</header>
			<main className={`${container} flex-1 py-10`}>{children}</main>
			<footer className="border-t">
				<div className={`${container} flex flex-wrap items-center justify-between gap-4 py-6 text-sm text-muted-foreground`}>
					<span>
						Progress through external courses, tracked in public.{" "}
						<a
							className="underline underline-offset-4 hover:text-primary"
							href="https://github.com/mcinarpro/learn.mehmetcinar.com"
						>
							Source
						</a>
					</span>
					<div className="flex items-center gap-4">
						<button type="button" className="underline underline-offset-4 hover:text-primary" onClick={onEdit}>
							{editing ? "Stop editing" : "Edit"}
						</button>
						<ThemeSwitcher />
					</div>
				</div>
			</footer>
		</div>
	);
}
