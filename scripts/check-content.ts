// Fails the build when a Learning Path file does not match the schema.
import { readdirSync, readFileSync } from "node:fs";
import { parseLearningPath } from "../src/content/schema.ts";

const dir = "content";
const files = readdirSync(dir).filter((f) => f.endsWith(".yaml"));
let failed = false;

for (const file of files) {
	try {
		const path = parseLearningPath(readFileSync(`${dir}/${file}`, "utf8"), file);
		const parts = path.stages.flatMap((s) => s.courses).reduce((n, c) => n + Math.max(c.parts.length, 1), 0);
		console.log(`✓ ${file}: ${path.stages.length} stages, ${parts} parts`);
	} catch (error) {
		failed = true;
		console.error(`✗ ${(error as Error).message}`);
	}
}

if (files.length === 0) {
	console.error(`✗ no Learning Path in ${dir}/`);
	failed = true;
}
process.exit(failed ? 1 : 0);
