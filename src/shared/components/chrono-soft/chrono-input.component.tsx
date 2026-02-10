import * as React from "react";
import { ComponentProps } from "react";
import { Input } from "../ui/input";
import { cn } from "@/src/lib/utils";
import { XIcon } from "lucide-react";

export type ChronoInputProps = ComponentProps<typeof Input> & {
	tone?: "default" | "dark";
	clearable?: boolean;
};

export const ChronoInput = React.forwardRef<
	HTMLInputElement,
	ChronoInputProps
>(function ChronoInput(
	{
		className,
		tone = "default",
		autoComplete = "off",
		clearable = false,
		onChange,
		value,
		defaultValue,
		disabled,
		readOnly,
		type,
		...props
	},
	forwardedRef
) {
	const innerRef = React.useRef<HTMLInputElement | null>(null);

	const setRefs = React.useCallback(
		(node: HTMLInputElement | null) => {
			innerRef.current = node;
			if (!forwardedRef) return;
			if (typeof forwardedRef === "function") {
				forwardedRef(node);
				return;
			}
			forwardedRef.current = node;
		},
		[forwardedRef]
	);

	const isControlled = value !== undefined;
	const [uncontrolledValue, setUncontrolledValue] = React.useState(() => {
		if (defaultValue === undefined || defaultValue === null) return "";
		return String(defaultValue);
	});

	const resolvedValue = isControlled
		? value === undefined || value === null
			? ""
			: String(value)
		: uncontrolledValue;

	const showClear =
		Boolean(clearable) &&
		!disabled &&
		!readOnly &&
		type !== "password" &&
		resolvedValue.length > 0;

	const handleChange = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			if (!isControlled) setUncontrolledValue(event.target.value);
			onChange?.(event);
		},
		[isControlled, onChange]
	);

	const handleClear = React.useCallback(() => {
		const input = innerRef.current;
		if (!input) return;

		// Use native setter so React's internal value tracker sees the change.
		const valueSetter = Object.getOwnPropertyDescriptor(
			HTMLInputElement.prototype,
			"value"
		)?.set;
		if (valueSetter) {
			valueSetter.call(input, "");
		} else {
			input.value = "";
		}

		// Fire events so any listeners (and React Hook Form) can react.
		try {
			input.dispatchEvent(new Event("input", { bubbles: true }));
			input.dispatchEvent(new Event("change", { bubbles: true }));
		} catch {
			// no-op
		}

		if (!isControlled) setUncontrolledValue("");

		input.focus();
	}, [isControlled]);

	return (
		<div className="relative w-full">
			<Input
				ref={setRefs}
				type={type}
				className={cn(
					"chrono-input",
					showClear ? "pr-8" : undefined,
					tone === "dark" &&
						"bg-foreground/5 text-foreground placeholder:text-foreground/60",
					className
				)}
				autoComplete={autoComplete}
				onChange={handleChange}
				value={isControlled ? value : undefined}
				defaultValue={!isControlled ? defaultValue : undefined}
				disabled={disabled}
				readOnly={readOnly}
				{...props}
			/>

			{showClear ? (
				<button
					type="button"
					aria-label="Limpiar"
					className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:ring-ring/30 focus-visible:ring-2 rounded-sm"
					onPointerDown={(event) => {
						event.preventDefault();
						event.stopPropagation();
					}}
					onClick={(event) => {
						event.preventDefault();
						event.stopPropagation();
						handleClear();
					}}
				>
					<XIcon className="size-3.5" />
				</button>
			) : null}
		</div>
	);
});

ChronoInput.displayName = "ChronoInput";
