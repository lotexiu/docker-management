import { ContainerData } from "../../../types";

function getStatusBadge(state: string): string {
	const badges: Record<string, string> = {
		running: "bg-green-100 text-green-800 border-green-200",
		paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
		exited: "bg-red-100 text-red-800 border-red-200",
		created: "bg-blue-100 text-blue-800 border-blue-200",
		restarting: "bg-orange-100 text-orange-800 border-orange-200",
	};
	return (
		badges[state.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200"
	);
}

function formatDate(timestamp: number): string {
	const date = new Date(timestamp * 1000);
	return date.toLocaleString("pt-BR");
}

function formatPorts(ports?: ContainerData["ports"]): string {
	if (!ports || ports.length === 0) return "-";
	return ports
		.map((p) => {
			if (p.PublicPort) {
				return `${p.PublicPort}:${p.PrivatePort}/${p.Type}`;
			}
			return `${p.PrivatePort}/${p.Type}`;
		})
		.join(", ");
}

export function DockerContainerColumns(
	renderActions: (container: ContainerData) => React.ReactNode,
) {
	return [
		{
			id: "name",
			header: "Nome",
			accessorKey: "name",
			cell: ({ row }: any) => (
				<div className="font-medium">{row.original.name}</div>
			),
		},
		{
			id: "image",
			header: "Imagem",
			accessorKey: "image",
			cell: ({ row }: any) => (
				<div className="font-mono text-xs">{row.original.image}</div>
			),
		},
		{
			id: "status",
			header: "Status",
			accessorKey: "state",
			cell: ({ row }: any) => (
				<span
					className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
						row.original.state,
					)}`}
				>
					{row.original.state}
				</span>
			),
		},
		{
			id: "ports",
			header: "Portas",
			accessorFn: (row: ContainerData) => formatPorts(row.ports),
			cell: ({ getValue }: any) => (
				<div className="text-xs">{getValue() as string}</div>
			),
		},
		{
			id: "created",
			header: "Criado",
			accessorKey: "created",
			cell: ({ row }: any) => (
				<div className="text-xs text-foreground">
					{formatDate(row.original.created)}
				</div>
			),
		},
		{
			id: "actions",
			header: () => <div className="text-right">Ações</div>,
			cell: ({ row }: any) => renderActions(row.original),
		},
	];
}
