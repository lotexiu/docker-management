"use client";
import { cn } from "@/lib/utils";
import * as React from "react";


export function getTableCaption() {
  function TableCaption({
    className, ...props
  }: React.ComponentProps<"caption">) {
    return (
      <caption
        data-slot="table-caption"
        className={cn(
          className
        )}
        {...props} />
    );
  }
  return TableCaption;
}