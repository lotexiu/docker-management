"use client";

import React from "react";
import { TableCell } from "@/components/ui/table-data/TableCell";
import { TableHead } from "@/components/ui/table-data/TableHead";
import { TableRow } from "@/components/ui/table-data/TableRow";
import { TableBody } from "@/components/ui/table-data/TableBody";
import { TableHeader } from "@/components/ui/table-data/TableHeader";
import { Table } from "@/components/ui/table-data/Table";
import { Play, Pause, StopCircle, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// TanStack Table imports
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { DockerTableColumns } from "./example/columns";
import { DockerTable } from "./example/table";

type ContainerItem = {
  id: string;
  name: string;
};

// Mock de dados para exemplo (client-side)
const MOCK: ContainerItem[] = [
  { id: "1", name: "web-server" },
  { id: "2", name: "db" },
  { id: "3", name: "redis-cache" },
];

export default function DockerPage() {
  // Estado local dos dados (no mundo real viria de fetch) // curto: items
  const [items] = React.useState<ContainerItem[]>(MOCK); // guarda os dados renderizados

  const columns = DockerTableColumns()
  const table = DockerTable(items, columns);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Gerenciar Containers</h1>
          <div>
            <Button onClick={() => alert("Adicionar container (mock)")}>Adicionar</Button>
          </div>
        </header>

        {/*
          Renderização da tabela usando os componentes UI locais.
          Observação: TanStack fornece os dados e helpers; a renderização é feita por nós.
        */}
        <Table className="w-full">
          <TableHeader>
            {/*
              TanStack organiza cabeçalhos em headerGroups (suporta col-spans e agrupamentos).
              Iteramos por cada headerGroup e cada header para renderizar o conteúdo.
            */}
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    // título centralizado para coluna de ações
                    className={header.id === "actions" ? "text-center" : undefined}
                    // se a coluna for ordenável, associamos o handler de toggle de ordenação
                    onClick={header.column.getToggleSortingHandler()}
                    // cursor pointer para indicar que é clicável (ordenável)
                    style={{ cursor: header.column.getCanSort() ? "pointer" : undefined }}
                  >
                    {/*
                      flexRender renderiza o conteúdo (header) que você definiu na ColumnDef
                      usamos header.isPlaceholder para pular cabeçalhos vazios (no caso de agrupamento)
                    */}
                    {header.isPlaceholder ? null : (
                      <>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {/* indicador simples de ordenação */}
                        {header.column.getIsSorted() === "asc" ? " ▲" : header.column.getIsSorted() === "desc" ? " ▼" : null}
                      </>
                    )}
                  </TableHead>
                ))}
              </tr>
            ))}
          </TableHeader>

          <TableBody>
            {/*
              Para as linhas, usamos table.getRowModel().rows — cada row tem cells visíveis.
            */}
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={cell.column.id === "actions" ? "text-center" : undefined}>
                    {/* flexRender também funciona para cells */}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
