"use client";
import { cn } from "@/lib/utils";
import * as React from "react";


export function getTableFooter(variant: string) {
  function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
    return (
      <tfoot
        data-slot="table-footer"
        className={cn(
          variant,
          className,
        )}
        {...props} />
    );
  }
  return TableFooter;
}
