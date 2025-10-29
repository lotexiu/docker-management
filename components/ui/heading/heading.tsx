import { HTMLAttributes } from "react";
import { HeadingProps } from "./types";
import { cn } from "@/lib/utils";

import "./heading.css"

const sizes: Record<HeadingProps["size"], string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl",
  xl: "text-3xl",
}

export function Heading({ level, size, children, className="", ...props }: HeadingProps) {
  const Component: keyof React.JSX.IntrinsicElements = `h${level}`;
	return (
		<div className={`heading-component-wrapper grow
			font-semibold 
			leading-tight 
			${sizes[size]} 
			bg-foreground/20
			rounded
			text-center
			content-center
		`}
		>
			<Component {...props} className={className}>
				{children}
			</Component>
		</div>
	);
}