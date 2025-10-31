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

export function DockerContainerPageContent({containers, ...props}:DockerContainerPageContentProps) {
	const { Table, TableHeader, TableRow, TableBody, TableCell, TableHead } = TableVariations({
		rowSize:"default",
		variants:"default",
		border:"weak",
		radius:"default"
	})


	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [data, setData] = React.useState<ContainerInfo[]>([]);
	React.useEffect(() => {
		if (containers) {
			setData(containers);
		}
	},containers)

	const refresh = React.useCallback(async () => {
		try {
			const res = await fetch("/api/docker");
			if (!res.ok) throw new Error("Falha ao buscar containers");
			const json = await res.json();
			setData(json);
		} catch (err) {
			console.error(err);
		}
	}, []);

	const handleAction = React.useCallback(async (opts: { action: string; id?: string }) => {
		const { action, id } = opts;
		try {
			const res = await fetch("/api/docker", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action, id }),
			});
			const body = await res.json().catch(() => ({}));
			if (!res.ok) {
				throw new Error(body.error || "Erro na requisição");
			}
			// após ação bem-sucedida, atualiza a listagem
			await refresh();
		} catch (err: any) {
			console.error(err);
			alert(err?.message || String(err));
		}
	}, [refresh]);

	const table = useReactTable({
		data: data || [],
		columns: DockerTableColumns(handleAction),
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