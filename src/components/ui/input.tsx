import * as React from "react"

import { cn } from "@/lib/utils"
import { ReactWrapper } from "@lotexiu/react/components/implementations"
import { Property } from "@lotexiu/typescript/natives/object/proxy/types";

export const Input = ReactWrapper(
	class Input extends ReactWrapper.ClientComponent<React.ComponentProps<"input">> {
		render(): React.ReactNode {
			let { id, children, "aria-invalid": invalid, disabled, type, value, onChange, className, ...props } = this.props;
			value = value ?? "";

			return (
				<div
					id={id}
					data-slot="input-wrapper"
					className={cn(
						"transition-[color,box-shadow]  flex",
						"border border-input bg-input/30 px-3 py-1 rounded-md items-center gap-2 shadow-xs",
						"focus-within:ring-2 focus-within:ring-ring/50 focus-within:border-ring",
						"aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
						"aria-disabled:opacity-60",
					)}
					aria-disabled={disabled}
					aria-invalid={invalid}
				>
					{children}
					<input
						id={`input-${id}`}
						type={type}
						data-slot="input"
						value={value}
						onChange={onChange}
						className={cn(
							"disabled:pointer-events-none disabled:cursor-not-allowed grow w-0",
							"bg-transparent outline-none rounded-sm",
							"selection:text-primary-foreground selection:bg-primary",
							"file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
							"placeholder:text-foreground",
							className
						)}
						aria-invalid={invalid}
						disabled={disabled}
						{...props}
					/>
				</div>
			)
		}
	}
)
