// app/api/docker/route.ts
import Docker from "dockerode";
import type { NextRequest } from "next/server";

// Conectar ao socket local (Linux). Em um ambiente remoto, passe host/port/certificates.
const docker = new Docker({ socketPath: "/var/run/docker.sock" });

// GET -> lista containers
export async function GET(req: NextRequest){
  // listContainers({ all: true }) retorna resumo dos containers
  const containers = await docker.listContainers({ all: true });
  return new Response(JSON.stringify(containers), { status: 200 });
}

// POST -> ações: start, stop, restart, remove, inspect, create, etc.
// Corpo esperado (JSON): { action: 'start'|'stop'|'restart'|'remove'|'inspect'|'create', id?: string, createOpts?: {...} }
export async function POST(req: NextRequest) {
  const body = await req.json();

  // controle simples (em produção valide autenticação/autorização!)
  const { action, id, createOpts } = body;

  if (!action) return new Response(JSON.stringify({ error: "action required" }), { status: 400 });

  try {
    if (action === "list") {
      const containers = await docker.listContainers({ all: true });
      return new Response(JSON.stringify(containers), { status: 200 });
    }

    if (action === "inspect") {
      if (!id) throw new Error("id required");
      const container = docker.getContainer(id);
      const info = await container.inspect();
      return new Response(JSON.stringify(info), { status: 200 });
    }

    if (action === "start") {
      if (!id) throw new Error("id required");
      const container = docker.getContainer(id);
      await container.start();
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    if (action === "stop") {
      if (!id) throw new Error("id required");
      const container = docker.getContainer(id);
      await container.stop();
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    if (action === "restart") {
      if (!id) throw new Error("id required");
      const container = docker.getContainer(id);
      await container.restart();
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    if (action === "remove") {
      if (!id) throw new Error("id required");
      const container = docker.getContainer(id);
      await container.remove({ force: true });
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    if (action === "create") {
      // createOpts: { Image: 'nginx', name: 'my-nginx', HostConfig: {...} }
      const container = await docker.createContainer(createOpts);
      // opcionalmente iniciar
      await container.start();
      return new Response(JSON.stringify({ ok: true, id: container.id }), { status: 201 });
    }

    return new Response(JSON.stringify({ error: "unknown action" }), { status: 400 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
}