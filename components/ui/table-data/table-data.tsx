"use client"

import { cn, cv } from "@/lib/utils";
import { TableProps, TableHeaderProps, TableBodyProps, TableFooterProps, TableRowProps, TableHeadProps, TableCellProps, TableCaptionProps } from "./types";
import { VariantProps } from "class-variance-authority";

export const TableVariations = cv({
  components: {
    Table,
    TableHeader,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    TableFooter,
    TableCaption,
  },
  settings: {
    variants: {
      default: {
        Table: "rounded-2xl border-2 p-0",
      }
    },
    rowSize: {
      default: {
        TableRow: "h-10",
      },
      compact: {
        TableRow: "h-6",
      },
    },
    radius: {
      default: {
        Table: "rounded-md",
        TableCell: "px-2",
        TableHead: "px-2",
      },
      none: {
        TableCell: "px-2",
        TableHead: "px-2",
      }
    },
    border: {
      default: {
        Table: "border",
        TableRow: "hover:bg-border/20 data-[state=selected]:bg-muted/20 border-b",
      },
      weak: {
        Table: "border border-border/50",
        TableRow: "hover:bg-border/20 data-[state=selected]:bg-muted/20 border-b border-border/50",
      },
      none: {
        Table: "",
      },
    }
  }
});

type TableVariationsType = VariantProps<typeof TableVariations>;

function Table({ variantSettings, className, ...props }: TableProps<TableVariationsType>) {
  return (
    <div data-slot="table-container"
      className={cn("relative w-full overflow-x-auto",
        variantSettings?.border,
        variantSettings?.radius
      )}
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ variantSettings, className, ...props }: TableHeaderProps<TableVariationsType>) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ variantSettings, className, ...props }: TableBodyProps<TableVariationsType>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ variantSettings, className, ...props }: TableFooterProps<TableVariationsType>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ variantSettings, className, ...props }: TableRowProps<TableVariationsType>) {
  return (
    <tr
      data-slot="table-row"
      className={cn("transition-colors",
        variantSettings?.rowSize,
        variantSettings?.border,
        className
      )}
      {...props}
    />
  )
}

function TableHead({ variantSettings, className, ...props }: TableHeadProps<TableVariationsType>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        // "h-10 px-2 align-middle",
        "text-left font-medium whitespace-nowrap",
        variantSettings?.radius,
        className
      )}
      {...props}
    />
  )
}

function TableCell({ variantSettings, className, ...props }: TableCellProps<TableVariationsType>) {
  return (
    <td
      data-slot="table-cell p-2"
      className={cn(
        // "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        variantSettings?.radius,
        className
      )}
      {...props}
    />
  )
}

function TableCaption({ variantSettings, className, ...props}: TableCaptionProps<TableVariationsType>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

export { Table, TableHeader, TableHead, TableBody, TableCell, TableRow, TableFooter, TableCaption };