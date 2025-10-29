"use client";
import React from "react";

type Column<T> = {
  key: string;
  title: React.ReactNode;
  render?: (item: T) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  className?: string;
};

export function Table<T>({ columns, data, className = "" }: TableProps<T>) {
  return (
    <div className={`overflow-hidden rounded-md border-border ${className}`}>
      <table className="w-full table-fixed border-collapse text-sm">
        <thead className="bg-muted text-left text-muted-foreground">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-2 font-medium ${col.headerClassName ?? ""}`}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-card text-card-foreground">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-muted-foreground">
                Nenhum item encontrado.
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="odd:bg-card even:bg-muted">
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 align-top ${col.cellClassName ?? ""}`}>
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
