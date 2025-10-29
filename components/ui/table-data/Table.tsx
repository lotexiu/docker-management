"use client";
import { cn } from "@/lib/utils";
import * as React from "react";

export function getTable(variant: string) {
  function Table({ className, ...props }: React.ComponentProps<"table">) {
    return (
      <div className={cn(variant,
        "overflow-auto",
      )}>
        <table
          data-slot="table"
          className={cn(
            "w-full text-sm", className
          )}
          {...props}
        ></table>
      </div>
    );
  }
  return Table;
}
