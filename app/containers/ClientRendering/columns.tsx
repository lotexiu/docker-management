import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ContainerInfo } from "dockerode";
import { Edit2, Pause, Play, StopCircle, Trash2 } from "lucide-react";
import React from "react";

export function DockerTableColumns() {
	/*
		Definição das colunas usando ColumnDef<T> do TanStack Table.
		- accessorKey: chave do objeto para acessar o valor (simples)
		- header: rótulo do cabeçalho (pode ser string ou função render)
		- cell: função que recebe o contexto da célula para renderizar conteúdo customizado
	*/
	return React.useMemo<ColumnDef<ContainerInfo>[]>(
		() => [
			{
				accessorKey: "name", // pega item.name automaticamente
				header: "Nome", // texto do cabeçalho
				cell: (info) => info.getValue(), // renderiza o valor da célula
			},
			{
				id: "actions", // coluna sem accessor (ações customizadas)
				header: "Ações",
				/*
					cell recebe o contexto com `row` — usamos row.original para acessar o objeto
					Aqui retornamos os botões de ação para cada linha
				*/
				cell: ({ row }) => (
					<div className="flex flex-wrap items-center justify-center gap-2">{/* container de botões */}
						<Button
							size="icon"
							variant="default"
							onClick={() => alert(`Iniciar ${row.original.Labels}`)}
							aria-label={`Iniciar ${row.original.Labels}`}
						>
							<Play className="h-4 w-4" />
						</Button>
						<Button
							size="icon"
							variant="secondary"
							onClick={() => alert(`Pausar ${row.original.Labels}`)}
							aria-label={`Pausar ${row.original.Labels}`}
						>
							<Pause className="h-4 w-4" />
						</Button>
						<Button
							size="icon"
							variant="destructive"
							onClick={() => alert(`Parar ${row.original.Labels}`)}
							aria-label={`Parar ${row.original.Labels}`}
						>
							<StopCircle className="h-4 w-4" />
						</Button>
						<Button
							size="icon"
							variant="outline"
							onClick={() => alert(`Editar ${row.original.Labels}`)}
							aria-label={`Editar ${row.original.Labels}`}
						>
							<Edit2 className="h-4 w-4" />
						</Button>
						<Button
							size="icon"
							variant="destructive"
							onClick={() => alert(`Deletar ${row.original.Labels}`)}
							aria-label={`Deletar ${row.original.Labels}`}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				),
			},
		],
		[]
	);
}