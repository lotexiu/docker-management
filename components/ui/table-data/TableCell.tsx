"use client";
import { cn } from "@/lib/utils";
import * as React from "react";

export function getTableCell(variant: string) {
  function TableCell({ className, ...props }: React.ComponentProps<"td">) {
    return (
      <td
        data-slot="table-cell"
        className={cn(
          variant,
          className,
        )}
        {...props} />
    );
  }
  return TableCell;
}