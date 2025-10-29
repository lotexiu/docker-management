import { HTMLAttributes } from "react";

export type Level = 1 | 2 | 3 | 4 | 5 | 6;

export type Size = "sm" | "md" | "lg" | "xl";

export type HeadingProps = {
	level: Level;
	size: Size;
	children: React.ReactNode;
} & HTMLAttributes<any>