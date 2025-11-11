# API de Gerenciamento de Containers Docker

API RESTful para gerenciar containers Docker usando Dockerode.

## Endpoints

### 1. Criar Container
**POST** `/api/docker/containers`

Cria um novo container Docker.

**Body:**
```json
{
  "name": "meu-container",
  "image": "nginx:latest",
  "env": ["ENV_VAR=valor"],
  "exposedPorts": {
    "80/tcp": {}
  },
  "hostConfig": {
    "portBindings": {
      "80/tcp": [{ "hostPort": "8080" }]
    },
    "restartPolicy": {
      "name": "always"
    }
  }
}
```

**Resposta (201):**
```json
{
  "success": true,
  "data": {
    "id": "abc123...",
    "name": "meu-container",
    "image": "nginx:latest",
    "status": "created",
    "created": "2025-11-11T..."
  },
  "message": "Container criado com sucesso"
}
```

---

### 2. Obter Container por ID
**GET** `/api/docker/containers/[id]`

Obtém informações detalhadas de um container específico.

**Parâmetros de URL:**
- `id`: ID do container

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": "abc123...",
    "name": "meu-container",
    "image": "nginx:latest",
    "status": "running",
    "state": "running",
    "created": 1699660800,
    "labels": {}
  },
  "message": "Container encontrado"
}
```

---

### 3. Atualizar Container
**PUT** `/api/docker/containers/[id]/update`

Executa ações no container ou atualiza suas configurações.

**Parâmetros de URL:**
- `id`: ID do container

**Body - Iniciar Container:**
```json
{
  "action": "start"
}
```

**Body - Pausar Container:**
```json
{
  "action": "pause"
}
```

**Body - Retomar Container:**
```json
{
  "action": "unpause"
}
```

**Body - Reiniciar Container:**
```json
{
  "action": "restart"
}
```

**Body - Parar Container:**
```json
{
  "action": "stop",
  "timeout": 10
}
```

**Body - Renomear Container:**
```json
{
  "action": "rename",
  "name": "novo-nome"
}
```

**Body - Atualizar Configurações:**
```json
{
  "action": "update",
  "config": {
    "memory": 536870912,
    "cpuShares": 512,
    "restartPolicy": {
      "name": "unless-stopped"
    }
  }
}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": "abc123...",
    "name": "meu-container",
    "image": "nginx:latest",
    "status": "running",
    "state": "running",
    "created": 1699660800
  },
  "message": "Container iniciado com sucesso"
}
```

---

### 4. Deletar Container
**DELETE** `/api/docker/containers/[id]/delete`

Remove um container.

**Parâmetros de URL:**
- `id`: ID do container

**Query Parameters (opcionais):**
- `force`: `true` para forçar remoção mesmo se estiver rodando
- `v`: `true` para remover volumes associados

**Exemplo:**
```
DELETE /api/docker/containers/abc123/delete?force=true&v=true
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": "abc123..."
  },
  "message": "Container removido com sucesso"
}
```

---

### 5. Listar Containers (Paginado)
**GET** `/api/docker/containers/list`

Lista containers com paginação.

**Query Parameters:**
- `page`: Número da página (padrão: 1)
- `pageSize`: Tamanho da página (padrão: 10, máx: 100)
- `all`: `true` para incluir containers parados (padrão: true)
- `filters`: JSON string com filtros Docker (opcional)

**Exemplo:**
```
GET /api/docker/containers/list?page=1&pageSize=20&all=true
```

**Exemplo com filtros:**
```
GET /api/docker/containers/list?filters={"status":["running"]}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "containers": [
      {
        "id": "abc123...",
        "name": "meu-container",
        "image": "nginx:latest",
        "status": "Up 2 hours",
        "state": "running",
        "created": 1699660800,
        "ports": [
          {
            "PrivatePort": 80,
            "PublicPort": 8080,
            "Type": "tcp"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 45,
      "totalPages": 3
    }
  },
  "message": "Containers listados com sucesso"
}
```

---

## Tratamento de Erros

Todas as rotas retornam erros no seguinte formato:

**Erro de Validação (400):**
```json
{
  "success": false,
  "error": "Nome é obrigatório",
  "message": "Erro de validação"
}
```

**Container Não Encontrado (404):**
```json
{
  "success": false,
  "error": "Container não encontrado",
  "message": "Container não existe"
}
```

**Erro Interno (500):**
```json
{
  "success": false,
  "error": "Mensagem de erro detalhada",
  "message": "Erro ao processar requisição"
}
```

---

## Tipos e Validações

Os tipos TypeScript e validações Zod estão definidos em:
- **types.ts**: Definições de tipos TypeScript
- **validation.ts**: Schemas de validação Zod
- **utils.ts**: Funções auxiliares e helpers

## Ações Disponíveis para PUT

1. **start**: Inicia um container parado
2. **pause**: Pausa um container em execução
3. **unpause**: Resume um container pausado
4. **restart**: Reinicia um container
5. **stop**: Para um container em execução
6. **rename**: Renomeia um container
7. **update**: Atualiza configurações de recursos do container

## Configurações Atualizáveis

Ao usar `action: "update"`, você pode modificar:

- `memory`: Limite de memória (bytes)
- `memorySwap`: Limite de memória + swap (bytes)
- `memoryReservation`: Soft limit de memória (bytes)
- `kernelMemory`: Limite de kernel memory (bytes)
- `cpuShares`: Peso de CPU shares
- `cpuPeriod`: Período de CPU
- `cpuQuota`: Quota de CPU
- `cpusetCpus`: CPUs permitidas (ex: "0-3")
- `cpusetMems`: Memory nodes permitidos
- `blkioWeight`: Peso de Block IO
- `restartPolicy`: Política de reinício

## Requisitos

- Docker daemon rodando e acessível via socket Unix
- Socket path: `/var/run/docker.sock`
- Node.js com Next.js 15+
- Pacotes: `dockerode`, `zod`
