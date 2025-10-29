"use client";
import { cn } from "@/lib/utils";
import * as React from "react";


export function getTableCaption(variant: string) {
  function TableCaption({
    className, ...props
  }: React.ComponentProps<"caption">) {
    return (
      <caption
        data-slot="table-caption"
        className={cn(
          variant,
          className
        )}
        {...props} />
    );
  }
  return TableCaption;
}