"use client";
import { cn } from "@/lib/utils";
import * as React from "react";

export function getTableHead(variant: string) {
  function TableHead({ className, ...props }: React.ComponentProps<"th">) {
    return (
      <th
        data-slot="table-head"
        className={cn(
          variant,
          className,
        )}
        {...props} />
    );
  }
  return TableHead;
}
