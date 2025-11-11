# Exemplos de Uso da API de Containers

Este arquivo contém exemplos práticos de como usar a API de gerenciamento de containers Docker.

## Cliente TypeScript/JavaScript

```typescript
// Classe helper para fazer requisições à API
class DockerContainerAPI {
  private baseURL = '/api/docker/containers';

  // Criar container
  async createContainer(config: {
    name?: string;
    image: string;
    env?: string[];
    exposedPorts?: Record<string, {}>;
    hostConfig?: any;
  }) {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return response.json();
  }

  // Obter container por ID
  async getContainer(id: string) {
    const response = await fetch(`${this.baseURL}/${id}`);
    return response.json();
  }

  // Listar containers com paginação
  async listContainers(params: {
    page?: number;
    pageSize?: number;
    all?: boolean;
    filters?: string;
  } = {}) {
    const query = new URLSearchParams({
      page: String(params.page || 1),
      pageSize: String(params.pageSize || 10),
      all: String(params.all !== false),
      ...(params.filters && { filters: params.filters }),
    });

    const response = await fetch(`${this.baseURL}/list?${query}`);
    return response.json();
  }

  // Atualizar/controlar container
  async updateContainer(id: string, action: {
    action: 'start' | 'pause' | 'unpause' | 'restart' | 'stop' | 'rename' | 'update';
    name?: string;
    timeout?: number;
    config?: any;
  }) {
    const response = await fetch(`${this.baseURL}/${id}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action),
    });
    return response.json();
  }

  // Deletar container
  async deleteContainer(id: string, options: {
    force?: boolean;
    removeVolumes?: boolean;
  } = {}) {
    const query = new URLSearchParams({
      ...(options.force && { force: 'true' }),
      ...(options.removeVolumes && { v: 'true' }),
    });

    const response = await fetch(`${this.baseURL}/${id}/delete?${query}`, {
      method: 'DELETE',
    });
    return response.json();
  }
}

// Exemplos de uso
const api = new DockerContainerAPI();

// 1. Criar um container Nginx
const newContainer = await api.createContainer({
  name: 'meu-nginx',
  image: 'nginx:latest',
  exposedPorts: { '80/tcp': {} },
  hostConfig: {
    portBindings: {
      '80/tcp': [{ hostPort: '8080' }],
    },
    restartPolicy: {
      name: 'always',
    },
  },
});
console.log('Container criado:', newContainer.data.id);

// 2. Iniciar o container
await api.updateContainer(newContainer.data.id, {
  action: 'start',
});
console.log('Container iniciado');

// 3. Listar todos os containers rodando (página 1, 20 itens)
const containers = await api.listContainers({
  page: 1,
  pageSize: 20,
  all: false, // apenas containers rodando
});
console.log('Total de containers:', containers.data.pagination.total);

// 4. Listar containers com filtro
const runningContainers = await api.listContainers({
  filters: JSON.stringify({ status: ['running'] }),
});

// 5. Obter informações de um container específico
const containerInfo = await api.getContainer(newContainer.data.id);
console.log('Status:', containerInfo.data.status);

// 6. Pausar o container
await api.updateContainer(newContainer.data.id, {
  action: 'pause',
});

// 7. Retomar o container
await api.updateContainer(newContainer.data.id, {
  action: 'unpause',
});

// 8. Atualizar configurações de recursos
await api.updateContainer(newContainer.data.id, {
  action: 'update',
  config: {
    memory: 536870912, // 512MB
    cpuShares: 512,
  },
});

// 9. Renomear o container
await api.updateContainer(newContainer.data.id, {
  action: 'rename',
  name: 'nginx-production',
});

// 10. Parar o container com timeout
await api.updateContainer(newContainer.data.id, {
  action: 'stop',
  timeout: 10,
});

// 11. Deletar o container (forçando e removendo volumes)
await api.deleteContainer(newContainer.data.id, {
  force: true,
  removeVolumes: true,
});
```

## Exemplos com cURL

```bash
# 1. Criar container
curl -X POST http://localhost:3002/api/docker/containers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "meu-nginx",
    "image": "nginx:latest",
    "exposedPorts": {"80/tcp": {}},
    "hostConfig": {
      "portBindings": {
        "80/tcp": [{"hostPort": "8080"}]
      }
    }
  }'

# 2. Listar containers (página 1, 10 itens)
curl "http://localhost:3002/api/docker/containers/list?page=1&pageSize=10&all=true"

# 3. Listar apenas containers rodando
curl "http://localhost:3002/api/docker/containers/list?filters=%7B%22status%22%3A%5B%22running%22%5D%7D"

# 4. Obter container por ID
curl http://localhost:3002/api/docker/containers/abc123

# 5. Iniciar container
curl -X PUT http://localhost:3002/api/docker/containers/abc123/update \
  -H "Content-Type: application/json" \
  -d '{"action": "start"}'

# 6. Pausar container
curl -X PUT http://localhost:3002/api/docker/containers/abc123/update \
  -H "Content-Type: application/json" \
  -d '{"action": "pause"}'

# 7. Reiniciar container
curl -X PUT http://localhost:3002/api/docker/containers/abc123/update \
  -H "Content-Type: application/json" \
  -d '{"action": "restart"}'

# 8. Renomear container
curl -X PUT http://localhost:3002/api/docker/containers/abc123/update \
  -H "Content-Type: application/json" \
  -d '{"action": "rename", "name": "novo-nome"}'

# 9. Atualizar recursos do container
curl -X PUT http://localhost:3002/api/docker/containers/abc123/update \
  -H "Content-Type: application/json" \
  -d '{
    "action": "update",
    "config": {
      "memory": 536870912,
      "cpuShares": 512
    }
  }'

# 10. Deletar container
curl -X DELETE "http://localhost:3002/api/docker/containers/abc123/delete?force=true&v=true"
```

## Exemplo de Fluxo Completo

```typescript
async function deployNginxContainer() {
  const api = new DockerContainerAPI();

  try {
    // 1. Criar container
    console.log('Criando container...');
    const result = await api.createContainer({
      name: 'nginx-app',
      image: 'nginx:alpine',
      env: ['NGINX_HOST=localhost', 'NGINX_PORT=80'],
      exposedPorts: { '80/tcp': {} },
      hostConfig: {
        portBindings: {
          '80/tcp': [{ hostPort: '8080' }],
        },
        restartPolicy: {
          name: 'unless-stopped',
        },
        memory: 268435456, // 256MB
        cpuShares: 512,
      },
      labels: {
        'app': 'nginx',
        'env': 'production',
      },
    });

    if (!result.success) {
      throw new Error(result.error);
    }

    const containerId = result.data.id;
    console.log(`Container criado: ${containerId}`);

    // 2. Iniciar container
    console.log('Iniciando container...');
    await api.updateContainer(containerId, { action: 'start' });
    console.log('Container iniciado com sucesso');

    // 3. Verificar status
    const info = await api.getContainer(containerId);
    console.log(`Status atual: ${info.data.status}`);

    // 4. Aguardar e verificar se está rodando
    await new Promise(resolve => setTimeout(resolve, 2000));

    const updatedInfo = await api.getContainer(containerId);
    if (updatedInfo.data.state === 'running') {
      console.log('✅ Container está rodando em http://localhost:8080');
    } else {
      console.warn('⚠️ Container não está rodando');
    }

    return containerId;
  } catch (error) {
    console.error('Erro ao criar container:', error);
    throw error;
  }
}

// Executar deploy
deployNginxContainer()
  .then(id => console.log(`Deploy concluído! Container ID: ${id}`))
  .catch(err => console.error('Deploy falhou:', err));
```

## Exemplo com React Hook

```typescript
import { useState, useEffect } from 'react';

function useContainers(page = 1, pageSize = 10) {
  const [containers, setContainers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        setLoading(true);
        const api = new DockerContainerAPI();
        const result = await api.listContainers({ page, pageSize });

        if (result.success) {
          setContainers(result.data.containers);
          setPagination(result.data.pagination);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContainers();
  }, [page, pageSize]);

  return { containers, pagination, loading, error };
}

// Uso no componente
function ContainerList() {
  const { containers, pagination, loading, error } = useContainers(1, 10);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h2>Containers ({pagination?.total})</h2>
      <ul>
        {containers.map(container => (
          <li key={container.id}>
            {container.name} - {container.status}
          </li>
        ))}
      </ul>
      <div>
        Página {pagination?.page} de {pagination?.totalPages}
      </div>
    </div>
  );
}
```

## Tratamento de Erros

```typescript
async function safeContainerOperation(containerId: string, action: string) {
  const api = new DockerContainerAPI();

  try {
    const result = await api.updateContainer(containerId, { action });

    if (!result.success) {
      // Erro retornado pela API
      console.error(`Erro na API: ${result.error}`);

      if (result.message === 'Container não existe') {
        console.log('Container não foi encontrado');
      } else if (result.message === 'Erro de validação') {
        console.log('Dados inválidos:', result.error);
      }

      return null;
    }

    return result.data;
  } catch (error) {
    // Erro de rede ou outro erro
    console.error('Erro de conexão:', error);
    return null;
  }
}
```
