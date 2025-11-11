# Página de Listagem de Containers Docker

Página interativa para visualizar e gerenciar containers Docker usando o padrão **ReactWrapper**.

## 📋 Funcionalidades

### Visualização
- ✅ Listagem de containers em tabela responsiva
- ✅ Informações exibidas:
  - Nome do container
  - Imagem utilizada
  - Status atual (com badge colorido)
  - Portas mapeadas
  - Data de criação
- ✅ Indicador visual de estado (running, paused, exited, etc.)
- ✅ Formatação de datas em pt-BR

### Paginação
- ✅ Navegação entre páginas
- ✅ Seleção de itens por página (5, 10, 20, 50)
- ✅ Contador total de containers
- ✅ Paginação inteligente com elipses

### Ações nos Containers
- ✅ **Iniciar** (Play) - Para containers parados ou criados
- ✅ **Pausar** (Pause) - Para containers em execução
- ✅ **Retomar** (Unpause) - Para containers pausados
- ✅ **Reiniciar** (Restart) - Para containers em execução
- ✅ **Parar** (Stop) - Para containers em execução
- ✅ **Deletar** (Trash) - Com confirmação antes de excluir

### UX/UI
- ✅ Loading states com spinner animado
- ✅ Feedback visual durante ações
- ✅ Mensagens de erro amigáveis
- ✅ Botão de atualizar manual
- ✅ Estados desabilitados durante operações
- ✅ Confirmação antes de deletar

## 🏗️ Arquitetura

### Padrão ReactWrapper

```typescript
const DockerContainersListPage = ReactWrapper(
  class DockerContainersListPage extends ReactWrapper.ClientComponent {
    // Estado da classe
    containers: ContainerData[] = [];
    pagination: PaginationData = {...};
    loading: boolean = true;
    error: string | null = null;
    actionLoading: Record<string, boolean> = {};

    setupHooks(): void {
      // Hooks do React aqui (useEffect)
    }

    // Métodos da classe
    async fetchContainers() { ... }
    async performContainerAction() { ... }
    async deleteContainer() { ... }

    render(): ReactNode {
      // JSX aqui
    }
  }
);
```

### Lifecycle

1. **Montagem**: `setupHooks()` configura useEffect
2. **useEffect**: Dispara `fetchContainers()` quando page/pageSize mudam
3. **Mutação**: Qualquer alteração em campos da classe
4. **Atualização**: `this.updateView()` força re-render do React

## 🎨 Componentes UI Utilizados

```typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, ... } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
```

Todos os componentes seguem o design system do shadcn/ui.

## 🔄 Fluxo de Dados

### 1. Carregar Containers
```
useEffect → fetchContainers() → API GET /api/docker/containers/list
  → this.containers = data
  → this.updateView()
```

### 2. Ação no Container
```
User Click → performContainerAction(id, action)
  → this.actionLoading[id] = true
  → API PUT /api/docker/containers/[id]/update
  → fetchContainers() (recarrega lista)
  → delete this.actionLoading[id]
  → this.updateView()
```

### 3. Deletar Container
```
User Click → confirm dialog
  → deleteContainer(id)
  → API DELETE /api/docker/containers/[id]/delete?force=true
  → fetchContainers() (recarrega lista)
  → this.updateView()
```

### 4. Mudar Página
```
User Click → handlePageChange(newPage)
  → this.pagination.page = newPage
  → this.updateView()
  → useEffect detecta mudança
  → fetchContainers()
```

## 🎯 Estados dos Containers

| Estado | Badge | Ações Disponíveis |
|--------|-------|-------------------|
| **running** | Verde | Pausar, Reiniciar, Parar, Deletar |
| **paused** | Amarelo | Retomar, Deletar |
| **exited** | Vermelho | Iniciar, Deletar |
| **created** | Azul | Iniciar, Deletar |
| **restarting** | Laranja | Aguardar |

## 📊 Tipos TypeScript

```typescript
interface ContainerData {
  id: string;
  name: string;
  image: string;
  status: string;
  state: string;
  created: number;
  ports?: Array<{
    IP?: string;
    PrivatePort: number;
    PublicPort?: number;
    Type: string;
  }>;
}

interface PaginationData {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
```

## 🛠️ Métodos Principais

### `fetchContainers()`
Busca lista de containers da API com paginação atual.

### `performContainerAction(containerId, action)`
Executa ação no container (start, pause, unpause, restart, stop).

### `deleteContainer(containerId)`
Deleta container após confirmação do usuário.

### `handlePageChange(newPage)`
Navega para página específica.

### `handlePageSizeChange(newSize)`
Altera quantidade de itens por página e reseta para página 1.

### `getStatusBadge(state)`
Retorna classes CSS para estilizar badge do status.

### `formatPorts(ports)`
Formata array de portas para exibição (ex: "8080:80/tcp").

### `formatDate(timestamp)`
Converte timestamp Unix para data formatada em pt-BR.

### `renderPaginationItems()`
Renderiza números de páginas com elipses inteligentes.

## 🎨 Cores e Estilos

### Status Colors
```typescript
const colors = {
  running: 'text-green-600',    // Verde - Ativo
  paused: 'text-yellow-600',    // Amarelo - Pausado
  exited: 'text-red-600',       // Vermelho - Parado
  created: 'text-blue-600',     // Azul - Criado
  restarting: 'text-orange-600' // Laranja - Reiniciando
};
```

### Status Badges
```typescript
const badges = {
  running: 'bg-green-100 text-green-800 border-green-200',
  paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  exited: 'bg-red-100 text-red-800 border-red-200',
  created: 'bg-blue-100 text-blue-800 border-blue-200',
  restarting: 'bg-orange-100 text-orange-800 border-orange-200'
};
```

## 🔧 Configuração

### Requisitos
- Next.js 15+ (App Router)
- API de containers configurada em `/api/docker/containers`
- Componentes UI do shadcn/ui instalados
- Lucide React para ícones

### Rota
```
/docker/containers/list
```

### Arquivo
```
apps/docker-management/src/app/docker/containers/list/page.tsx
```

## 📱 Responsividade

- Layout responsivo com container centralizado
- Tabela com scroll horizontal em telas pequenas
- Textos adaptativos (ex: "Previous" oculto em mobile)
- Botões com tamanhos adequados para touch

## 🚀 Performance

- **Lazy Loading**: Apenas dados da página atual são carregados
- **Debouncing**: Ações desabilitadas durante execução
- **Otimização**: Re-render apenas quando necessário via `updateView()`
- **Cache**: useEffect com dependências específicas

## 🐛 Tratamento de Erros

1. **Erro de API**: Exibe mensagem em banner vermelho
2. **Erro de Rede**: Captura e exibe mensagem amigável
3. **Erro de Ação**: Feedback imediato ao usuário
4. **Container não encontrado**: API retorna 404 e exibe erro

## 🔒 Segurança

- **Confirmação de Deleção**: Dialog nativo antes de deletar
- **Force Delete**: Usa flag `force=true` para garantir remoção
- **Validação**: Tipos TypeScript garantem dados corretos
- **Estados Desabilitados**: Previne múltiplas ações simultâneas

## 🎯 Melhorias Futuras

- [ ] Filtros por status/nome/imagem
- [ ] Busca em tempo real
- [ ] Visualização em cards (alternativa à tabela)
- [ ] Exportar lista para CSV
- [ ] Detalhes do container em modal
- [ ] Logs do container em tempo real
- [ ] Métricas de uso (CPU, memória)
- [ ] Bulk actions (ações em múltiplos containers)

## 📖 Exemplo de Uso

```typescript
// A página é auto-contida e não precisa de props
import DockerContainersListPage from '@/app/docker/containers/list/page';

// Em outro componente ou rota
<DockerContainersListPage />
```

## 🧪 Testing

Para testar a página:

1. Certifique-se que a API está rodando
2. Acesse `http://localhost:3002/docker/containers/list`
3. Verifique se os containers são listados
4. Teste todas as ações (start, pause, stop, etc.)
5. Teste a paginação e mudança de tamanho
6. Teste cenários de erro (API offline, etc.)

---

**Desenvolvido com o padrão ReactWrapper** - Classes OOP para React! 🚀
