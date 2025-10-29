"use client";
import { cn } from "@/lib/utils";
import * as React from "react";

export function getTableRow(variant: string) {
  function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
    return (
      <tr
        data-slot="table-row"
        className={cn(variant,
          "transition-colors",
          className
        )}
        {...props} />
    );
  }
  return TableRow;
}
