import { useCallback, useEffect, useState } from "react";
import { learningPathBySlug } from "../content";
import { Layout } from "@/components/layout";
import { HomePage } from "@/components/home-page";
import { PathPage } from "@/components/path-page";
import { TokenDialog } from "@/components/token-dialog";
import { readToken, writeToken } from "@/lib/progress";

// Two kinds of page: "/" lists the Learning Paths, "/<slug>/" shows one.
function route(pathname: string) {
	const slug = pathname.replace(/^\/|\/$/g, "");
	if (!slug) return { kind: "home" as const };
	const path = learningPathBySlug.get(slug);
	return path ? { kind: "path" as const, path } : { kind: "not-found" as const };
}

function App() {
	const page = route(window.location.pathname);
	const [token, setToken] = useState<string | null>(readToken);
	const [tokenOpen, setTokenOpen] = useState(false);
	const [refused, setRefused] = useState(false);

	const saveToken = (value: string | null) => {
		writeToken(value);
		setToken(value);
		setRefused(false);
	};
	const onRefused = useCallback(() => {
		writeToken(null);
		setToken(null);
		setRefused(true);
		setTokenOpen(true);
	}, []);

	useEffect(() => {
		document.title =
			page.kind === "path" ? `${page.path.title} – Learning – Mehmet Cinar` : "Learning – Mehmet Cinar";
	}, [page]);

	return (
		<Layout editing={!!token} onEdit={() => (token ? saveToken(null) : setTokenOpen(true))}>
			{page.kind === "home" && <HomePage />}
			{page.kind === "path" && <PathPage path={page.path} token={token} onRefused={onRefused} />}
			{page.kind === "not-found" && (
				<section className="py-16">
					<h1 className="text-2xl font-semibold">Page not found</h1>
					<p className="mt-2 text-muted-foreground">
						There is no Learning Path at this address.{" "}
						<a className="text-primary underline underline-offset-4" href="/">
							See all Learning Paths
						</a>
					</p>
				</section>
			)}
			<TokenDialog open={tokenOpen} refused={refused} onOpenChange={setTokenOpen} onSave={saveToken} />
		</Layout>
	);
}

export default App;
