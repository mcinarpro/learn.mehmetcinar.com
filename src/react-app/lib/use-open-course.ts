import { useEffect, useRef, useState } from "react";
import type { Course } from "../../content/schema";

// The open Course lives in the URL hash (#<course-id>): a Course can be linked, and Back
// closes its dialog. Stage anchors (#stage-…) never match a Course id, so they close it too.
export function useOpenCourse(courses: Course[]) {
	const fromHash = () => {
		const id = decodeURIComponent(window.location.hash.slice(1));
		return courses.find((c) => c.id === id) ?? null;
	};
	const [course, setCourse] = useState<Course | null>(fromHash);
	const pushed = useRef(false);

	useEffect(() => {
		const onPop = () => {
			pushed.current = false;
			setCourse(fromHash());
		};
		window.addEventListener("popstate", onPop);
		return () => window.removeEventListener("popstate", onPop);
		// fromHash only reads `courses`, which is fixed for a page.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const open = (next: Course) => {
		if (course) {
			window.history.replaceState(null, "", `#${next.id}`);
		} else {
			window.history.pushState(null, "", `#${next.id}`);
			pushed.current = true;
		}
		setCourse(next);
	};

	const close = () => {
		if (pushed.current) {
			window.history.back();
			return;
		}
		window.history.replaceState(null, "", window.location.pathname);
		setCourse(null);
	};

	const index = course ? courses.indexOf(course) : -1;
	return {
		course,
		previous: index > 0 ? courses[index - 1] : null,
		next: index >= 0 && index < courses.length - 1 ? courses[index + 1] : null,
		open,
		close,
	};
}
