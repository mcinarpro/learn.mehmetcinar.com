import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export function TokenDialog({
	open,
	refused,
	onOpenChange,
	onSave,
}: {
	open: boolean;
	refused: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: (token: string) => void;
}) {
	const [value, setValue] = useState("");

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<form
					className="grid gap-4"
					onSubmit={(e) => {
						e.preventDefault();
						if (!value.trim()) return;
						onSave(value.trim());
						setValue("");
						onOpenChange(false);
					}}
				>
					<DialogHeader>
						<DialogTitle>Edit progress</DialogTitle>
						<DialogDescription>
							{refused
								? "The edit token was refused. Paste it again."
								: "Paste the edit token. It stays in this browser until you stop editing."}
						</DialogDescription>
					</DialogHeader>
					<input
						id="edit-token"
						type="password"
						autoComplete="off"
						aria-label="Edit token"
						className="h-9 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
						value={value}
						onChange={(e) => setValue(e.target.value)}
					/>
					<DialogFooter>
						<Button type="submit">Start editing</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
