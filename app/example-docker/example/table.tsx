import { ColumnDef, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import React from "react";

export function DockerTable<T>(
	items: T[],
	columns: ColumnDef<T>[],
) {
	const [sorting, setSorting] = React.useState<SortingState>([]);

  /*
    Criamos a instância da tabela com useReactTable.
    - data: a lista de itens
    - columns: definição das colunas
    - getCoreRowModel: fornece o row model básico
    - getSortedRowModel: ativa ordenação local
    - state / onSortingChange: conecta o estado de sorting (controlado)
  */
	return useReactTable({
		data: items,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});
}