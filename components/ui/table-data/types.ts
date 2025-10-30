import { VariantProp } from "@/lib/types";
import * as React from "react";


export type TableProps<S> = React.ComponentProps<"table"> & VariantProp<S>;
export type TableHeaderProps<S> = React.ComponentProps<"thead"> & VariantProp<S>;
export type TableBodyProps<S> = React.ComponentProps<"tbody"> & VariantProp<S>;
export type TableFooterProps<S> = React.ComponentProps<"tfoot"> & VariantProp<S>;
export type TableRowProps<S> = React.ComponentProps<"tr"> & VariantProp<S>;
export type TableHeadProps<S> = React.ComponentProps<"th"> & VariantProp<S>;
export type TableCellProps<S> = React.ComponentProps<"td"> & VariantProp<S>;
export type TableCaptionProps<S> = React.ComponentProps<"caption"> & VariantProp<S>;
