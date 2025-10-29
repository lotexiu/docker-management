"use client";
import { cn } from "@/lib/utils";
import * as React from "react";

export function getTableHeader(variant: string) {
  function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
    return (
      <thead
        data-slot="table-header"
        className={cn(
          variant,
          className
        )}
        {...props} />
    );
  }
  return TableHeader;
}
