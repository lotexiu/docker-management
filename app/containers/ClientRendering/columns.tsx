import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ContainerInfo } from "dockerode";
import { Edit2, Pause, Play, StopCircle, Trash2 } from "lucide-react";
import React from "react";

function formatPorts(ports?: Array<{ IP?: string; PrivatePort: number; PublicPort?: number; Type: string }>) {
	if (!ports || ports.length === 0) return "-";
	return ports
		.map((p) => {
			const privatePart = `${p.PrivatePort}/${p.Type}`;
			if (p.PublicPort) {
				const ipPart = p.IP && p.IP !== "0.0.0.0" ? `${p.IP}:` : "";
				return `${ipPart}${p.PublicPort}->${privatePart}`;
			}
			return privatePart;
		})
		.join(", ");
}

type ActionHandler = (opts: { action: string; id?: string }) => Promise<void> | void;

export function DockerTableColumns(onAction?: ActionHandler) {
	/*
		Colunas sugeridas para containers:
		- id (curto)
		- names (join)
		- image
		- created (data legível)
		- state
		- status
		- ports (formatado)
		- actions (botões)
	*/
	return React.useMemo<ColumnDef<ContainerInfo>[]>(
		() => [
			{
				id: "id",
				header: "ID",
				accessorFn: (row) => (row.Id ? row.Id.substring(0, 12) : "-"),
				cell: (info) => info.getValue() as string,
			},
			{
				id: "names",
				header: "Nomes",
				accessorFn: (row) => (Array.isArray(row.Names) ? row.Names.map((n) => n.replace(/^\//, "")).join(", ") : (row.Names as any) ?? "-"),
				cell: (info) => info.getValue() as string,
			},
			{
				accessorKey: "Image",
				header: "Image",
				cell: (info) => info.getValue() as string,
			},
			{
				id: "created",
				header: "Criado",
				accessorFn: (row) => (row.Created ? new Date(row.Created * 1000).toLocaleString() : "-"),
				cell: (info) => info.getValue() as string,
			},
			{
				accessorKey: "State",
				header: "State",
				cell: (info) => info.getValue() as string,
			},
			{
				accessorKey: "Status",
				header: "Status",
				cell: (info) => info.getValue() as string,
			},
			{
				id: "ports",
				header: "Ports",
				accessorFn: (row) => formatPorts((row as any).Ports),
				cell: (info) => info.getValue() as string,
			},
			{
				id: "actions",
				header: "Ações",
				cell: ({ row }) => {
					const label = Array.isArray(row.original.Names) ? row.original.Names.join(", ") : row.original.Id?.substring(0, 12);
					const id = row.original.Id;
					return (
						<div className="flex flex-wrap items-center justify-center gap-2">{/* container de botões */}
							<Button
								size="icon"
								variant="default"
								onClick={async () => {
									try {
										if (onAction) await onAction({ action: "start", id });
									} catch (err) {
										console.error(err);
										alert("Erro ao iniciar container");
									}
								}}
								aria-label={`Iniciar ${label}`}
							>
								<Play className="h-4 w-4" />
							</Button>
							<Button
								size="icon"
								variant="secondary"
								onClick={async () => {
									try {
										if (onAction) await onAction({ action: "pause", id });
									} catch (err) {
										console.error(err);
										alert("Erro ao pausar container");
									}
								}}
								aria-label={`Pausar ${label}`}
							>
								<Pause className="h-4 w-4" />
							</Button>
							<Button
								size="icon"
								variant="destructive"
								onClick={async () => {
									try {
										if (onAction) await onAction({ action: "stop", id });
									} catch (err) {
										console.error(err);
										alert("Erro ao parar container");
									}
								}}
								aria-label={`Parar ${label}`}
							>
								<StopCircle className="h-4 w-4" />
							</Button>
							<Button
								size="icon"
								variant="outline"
								onClick={() => alert(`Editar ${label}`)}
								aria-label={`Editar ${label}`}
							>
								<Edit2 className="h-4 w-4" />
							</Button>
							<Button
								size="icon"
								variant="destructive"
								onClick={() => alert(`Deletar ${label}`)}
								aria-label={`Deletar ${label}`}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					);
				},
			},
		],
		[]
	);
}