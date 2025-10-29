"use client";
import { cn } from "@/lib/utils";
import * as React from "react";

export function getTableBody(variant: string) {
  function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
    return (
      <tbody
        data-slot="table-body"
        className={cn(
          variant,
          className,
        )}
        {...props} />
    );
  }
  return TableBody;
}