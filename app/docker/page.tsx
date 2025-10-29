"use client";
import React from "react";
import Table from "../../components/ui/table";
import { Play, Pause, StopCircle, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ContainerItem = {
  id: string;
  name: string;
};

const MOCK: ContainerItem[] = [
  { id: "1", name: "web-server" },
  { id: "2", name: "db" },
  { id: "3", name: "redis-cache" },
];

export default function DockerPage() {
  const [items] = React.useState<ContainerItem[]>(MOCK);

  const columns = [
    { key: "name", title: "Nome", render: (item: ContainerItem) => item.name },
    {
      key: "actions",
      title: "Ações",
      headerClassName: "text-center",
      cellClassName: "text-center",
      render: (item: ContainerItem) => (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button size="icon" variant="default" onClick={() => alert(`Iniciar ${item.name}`)} aria-label={`Iniciar ${item.name}`}>
            <Play className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" onClick={() => alert(`Pausar ${item.name}`)} aria-label={`Pausar ${item.name}`}>
            <Pause className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="destructive" onClick={() => alert(`Parar ${item.name}`)} aria-label={`Parar ${item.name}`}>
            <StopCircle className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" onClick={() => alert(`Editar ${item.name}`)} aria-label={`Editar ${item.name}`}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="destructive" onClick={() => alert(`Deletar ${item.name}`)} aria-label={`Deletar ${item.name}`}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Gerenciar Containers</h1>
          <div>
            <Button onClick={() => alert("Adicionar container (mock)")}>Adicionar</Button>
          </div>
        </header>

        <Table columns={columns} data={items} />
      </div>
    </div>
  );
}
