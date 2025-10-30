"use client";

import { TableVariations } from "@/components/ui/table-data/table-data";
import { flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { ContainerInfo } from "dockerode";
import React from "react";
import { DockerTableColumns } from "./columns";
import { Button } from "@/components/ui/button";

interface DockerContainerPageContentProps {
	containers?: ContainerInfo[];
}

export function DockerContainerPageContent(props:DockerContainerPageContentProps) {
	const { Table, TableHeader, TableRow, TableBody, TableCell, TableHead } = TableVariations({
		rowSize:"compact",
		variants:"default",
		border:"weak",
		radius:"default"
	})

	const [sorting, setSorting] = React.useState<SortingState>([]);
	
	const table = useReactTable({
		data: props.containers || [],
		columns: DockerTableColumns(),
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<div>
			<div className="flex justify-end my-2">
				<Button onClick={() => alert("Adicionar container (mock)")}>Adicionar</Button>
			</div>
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup, column) => (
						<TableRow key={headerGroup.id}>
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
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows.map((row) => (
						<TableRow key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<TableCell key={cell.id} className={cell.column.id === "actions" ? "text-center" : undefined}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);


	// return (
	// 	<div>
	// 		<h2>Conteúdo do Docker Container (Client Rendering)</h2>
	// 		{props.containers && props.containers.length > 0 ? (
	// 			<ul>
	// 				{props.containers.map(container => (
	// 					<li key={container.Id}>{container.Names.join(", ")}</li>
	// 				))}
	// 			</ul>
	// 		) : (
	// 			<p>Nenhum container encontrado.</p>
	// 		)}
	// 	</div>
	// );
}