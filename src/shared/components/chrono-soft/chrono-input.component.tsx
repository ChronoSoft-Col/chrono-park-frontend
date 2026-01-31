import { ComponentProps } from "react";
import { Input } from "../ui/input";
import { cn } from "@/src/lib/utils";

export type ChronoInputProps = ComponentProps<typeof Input> & {
	tone?: "default" | "dark";
};

export function ChronoInput({ className, tone = "default", autoComplete = "off", ...props }: ChronoInputProps) {
	return (
		<Input
			className={cn(
				"chrono-input",
				tone === "dark" && "bg-foreground/5 text-foreground placeholder:text-foreground/60",
				className
			)}
			autoComplete={autoComplete}
			{...props}
		/>
	);
}
