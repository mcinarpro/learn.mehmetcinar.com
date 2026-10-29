import { useCallback, useEffect, useRef, useState } from "react";
import { emptyProgress, progressSchema, type Progress } from "../../content/progress";

const TOKEN_KEY = "learn:edit-token";
const SAVE_DELAY_MS = 800;

export type SaveStatus = "idle" | "saving" | "saved" | "refused" | "failed";

export function readToken(): string | null {
	try {
		return localStorage.getItem(TOKEN_KEY);
	} catch {
		return null;
	}
}

export function writeToken(token: string | null) {
	try {
		if (token) localStorage.setItem(TOKEN_KEY, token);
		else localStorage.removeItem(TOKEN_KEY);
	} catch {
		// Private windows can refuse storage; editing then lasts for this page only.
	}
}

export async function fetchProgress(slug: string): Promise<Progress> {
	const response = await fetch(`/api/progress/${slug}`);
	if (!response.ok) throw new Error(`GET progress: ${response.status}`);
	return progressSchema.parse(await response.json());
}

// Loads one Learning Path's Progress and saves changes in batches, one PUT per pause.
export function useProgress(slug: string, token: string | null, onRefused: () => void) {
	const [progress, setProgress] = useState<Progress>(emptyProgress);
	const [loaded, setLoaded] = useState(false);
	const [status, setStatus] = useState<SaveStatus>("idle");
	const timer = useRef<number | undefined>(undefined);

	useEffect(() => {
		let active = true;
		fetchProgress(slug)
			.then((p) => active && setProgress(p))
			.catch(() => active && setStatus("failed"))
			.finally(() => active && setLoaded(true));
		return () => {
			active = false;
		};
	}, [slug]);

	const save = useCallback(
		(next: Progress) => {
			window.clearTimeout(timer.current);
			setStatus("saving");
			timer.current = window.setTimeout(async () => {
				try {
					const response = await fetch(`/api/progress/${slug}`, {
						method: "PUT",
						headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
						body: JSON.stringify({ parts: next.parts, checkpoints: next.checkpoints }),
					});
					if (response.status === 401) {
						setStatus("refused");
						onRefused();
						return;
					}
					setStatus(response.ok ? "saved" : "failed");
				} catch {
					setStatus("failed");
				}
			}, SAVE_DELAY_MS);
		},
		[slug, token, onRefused],
	);

	const update = (change: (p: Progress) => Progress) => {
		if (!token) return;
		const next = change(progress);
		setProgress(next);
		save(next);
	};

	const togglePart = (id: string) =>
		update((p) => ({ ...p, parts: toggle(p.parts, id) }));
	const setParts = (ids: string[], done: boolean) =>
		update((p) => ({ ...p, parts: ids.reduce((acc, id) => (done ? { ...acc, [id]: true } : omit(acc, id)), p.parts) }));
	const toggleCheckpoint = (stageId: string) =>
		update((p) => ({ ...p, checkpoints: toggle(p.checkpoints, stageId) }));

	return { progress, loaded, status, togglePart, setParts, toggleCheckpoint };
}

function toggle(set: Record<string, true>, id: string): Record<string, true> {
	return set[id] ? omit(set, id) : { ...set, [id]: true };
}

function omit(set: Record<string, true>, id: string): Record<string, true> {
	const next = { ...set };
	delete next[id];
	return next;
}
