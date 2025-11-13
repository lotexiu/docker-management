# Container Create - Versão Otimizada

Esta é uma versão otimizada do formulário de criação de containers Docker, resolvendo os problemas de performance da versão anterior (`create-old`).

## 🎯 Problemas Resolvidos

### Versão Antiga (`create-old`)
1. **Estado centralizado no pai**: Todos os campos (name, image, ports, envVars, etc.) eram gerenciados no `page.tsx`
2. **Callbacks excessivos**: Cada mudança de input chamava `onFieldChange()` que executava `updateView()` no componente pai
3. **Re-renders em cascata**: Quando `page.tsx` re-renderizava, TODOS os componentes filhos re-renderizavam desnecessariamente
4. **Prop drilling**: Passar dados e callbacks por múltiplos níveis causava complexidade

### Versão Nova (`create`)
1. **Estado local nos componentes**: Cada seção gerencia seu próprio estado independentemente
2. **Comunicação apenas no submit**: O `page.tsx` só coleta dados quando o formulário é submetido
3. **Sem callbacks desnecessários**: Não há propagação de mudanças para o pai durante digitação
4. **Performance otimizada**: Apenas o componente que mudou re-renderiza

## 🏗️ Arquitetura

### Interface `FormDataProvider<T>`
Cada componente que gerencia dados implementa esta interface:

```typescript
interface FormDataProvider<T> {
  getData(): T;  // Retorna os dados atuais
  reset(): void; // Reseta o estado
}
```

### Componentes e Responsabilidades

#### `page.tsx` (Componente Pai)
- **Responsabilidades**:
  - Estado de UI global (loading, error, successMessage)
  - Lógica de submit (validação, construção do payload, chamada à API)
  - Navegação após sucesso
- **O que NÃO faz**:
  - Não gerencia campos individuais
  - Não força re-render durante digitação
  - Não passa callbacks para cada mudança de campo

#### Componentes Filhos (Auto-gerenciados)
Cada componente é responsável pelo seu próprio estado:

1. **BasicFields** (`BasicFields.tsx`)
   - Gerencia: name, image, cmd, workingDir, user, tty
   - Re-renderiza apenas quando seus campos mudam

2. **Ports** (`Ports.tsx`)
   - Gerencia: array de portas com containerPort, hostPort, protocol
   - Re-renderiza apenas ao adicionar/remover/editar portas

3. **Environment** (`Environment.tsx`)
   - Gerencia: array de variáveis de ambiente
   - Re-renderiza apenas ao modificar variáveis

4. **Volumes** (`Volumes.tsx`)
   - Gerencia: array de montagens de volumes
   - Re-renderiza apenas ao modificar volumes

5. **Labels** (`Labels.tsx`)
   - Gerencia: array de labels
   - Re-renderiza apenas ao modificar labels

6. **Advanced** (`Advanced.tsx`)
   - Gerencia: memory, cpuShares, restartPolicy, networkMode
   - Re-renderiza apenas quando seus campos mudam

7. **Messages** (`Messages.tsx`)
   - Apenas apresenta error e successMessage do pai
   - Re-renderiza apenas quando mensagens mudam

8. **Actions** (`Actions.tsx`)
   - Apenas apresenta botões de submit e reset
   - Re-renderiza apenas quando loading muda

### Content.tsx (Coordenador)
Componente intermediário que:
- Armazena referências às instâncias dos componentes filhos via `onInstanceReady`
- Coleta dados de todos os filhos no submit via `getData()`
- Reseta todos os filhos via `reset()`
- Passa apenas dados necessários (error, successMessage, loading) para baixo

## 🔄 Fluxo de Dados

### 1. Inicialização
```
page.tsx renderiza
  ↓
Content.tsx renderiza
  ↓
Componentes filhos montam
  ↓
Cada filho chama onInit() → props.onInstanceReady(this)
  ↓
Content.tsx armazena referências às instâncias
```

### 2. Digitação/Edição (SEM propagação!)
```
Usuário digita em BasicFields
  ↓
this.image = e.target.value
  ↓
this.updateView()
  ↓
APENAS BasicFields re-renderiza
```

### 3. Submit
```
Usuário clica "Criar Container"
  ↓
Content.handleSubmit() coleta dados:
  - this.basicFieldsInstance.getData()
  - this.portsInstance.getData()
  - etc.
  ↓
props.onSubmit(data) → page.handleSubmit(data)
  ↓
page.tsx constrói payload e faz API call
  ↓
page.tsx atualiza loading/error/successMessage
  ↓
APENAS Messages e Actions re-renderizam
```

### 4. Reset
```
Usuário clica "Limpar Formulário"
  ↓
Content.handleReset()
  ↓
Chama reset() em todas as instâncias:
  - this.basicFieldsInstance.reset()
  - this.portsInstance.reset()
  - etc.
  ↓
Cada componente reseta seu estado local
  ↓
props.onReset() → page.handleReset()
  ↓
page.tsx limpa error/successMessage
```

## ⚡ Benefícios de Performance

### Antes (create-old)
```
Usuário digita 1 caractere no campo "image"
  ↓
onFieldChange("image", value)
  ↓
page.tsx: this.image = value
  ↓
page.tsx: this.updateView()
  ↓
page.tsx re-renderiza (componente inteiro)
  ↓
Content re-renderiza (passa novos props)
  ↓
BasicFields re-renderiza
  ↓
Ports re-renderiza (desnecessário!)
  ↓
Environment re-renderiza (desnecessário!)
  ↓
Volumes re-renderiza (desnecessário!)
  ↓
Labels re-renderiza (desnecessário!)
  ↓
Advanced re-renderiza (desnecessário!)
  ↓
Actions re-renderiza (desnecessário!)

= 8 componentes re-renderizados por 1 tecla digitada!
```

### Depois (create)
```
Usuário digita 1 caractere no campo "image"
  ↓
BasicFields: this.image = value
  ↓
BasicFields: this.updateView()
  ↓
BasicFields re-renderiza

= 1 componente re-renderizado por 1 tecla digitada!
```

## 📊 Comparação de Re-renders

| Ação | create-old | create |
|------|------------|--------|
| Digitar no campo "image" | 8 re-renders | 1 re-render |
| Adicionar porta | 8 re-renders | 1 re-render |
| Editar variável de ambiente | 8 re-renders | 1 re-render |
| Submit (API call) | 8 re-renders | 2 re-renders (Messages + Actions) |

**Redução de ~87% no número de re-renders durante edição!**

## 🎨 Padrões Utilizados

### 1. Estado Local com Comunicação Diferida
- Cada componente é autônomo
- Dados só são coletados quando realmente necessários (submit)
- Evita sincronização desnecessária

### 2. Instance Callback Pattern
```typescript
// Componente filho expõe sua instância para o pai
onInit(): void {
  this.props.onInstanceReady?.(this);
}

// Pai armazena e usa a instância
onInstanceReady={(instance) => {
  this.portsInstance = instance;
}}
```

### 3. Separation of Concerns
- **UI State** (loading, error, success) → `page.tsx`
- **Form Data** (campos do formulário) → Componentes filhos
- **Business Logic** (validação, API) → `page.tsx`

## 🔧 Como Adicionar um Novo Campo

### Se for um campo simples (em seção existente):
1. Adicione o campo na classe do componente correspondente
2. Atualize o método `getData()` para incluí-lo
3. Adicione o input no `render()`

### Se for uma nova seção:
1. Crie um novo componente seguindo o padrão dos existentes
2. Implemente `FormDataProvider<T>`
3. Adicione `onInit()` para notificar o pai
4. Em `Content.tsx`, adicione:
   - Uma nova instância (`newSectionInstance`)
   - Renderize o componente com `onInstanceReady`
   - Colete dados no `handleSubmit`
   - Resete no `handleReset`
5. Em `page.tsx`, atualize o tipo do parâmetro de `handleSubmit`

## 📝 Notas Técnicas

### Por que não usar React Context?
Context causaria re-renders em TODOS os consumers quando qualquer valor muda. Nossa abordagem isola mudanças completamente.

### Por que não usar useState com callbacks otimizados?
Mesmo com `useCallback` e `memo`, ainda teríamos prop drilling e comparações desnecessárias. Estado local é mais direto.

### Por que não usar refs padrão do React?
`ReactWrapper` não suporta refs nativamente. O pattern `onInstanceReady` é mais explícito e funciona perfeitamente com a arquitetura do projeto.

### Compatibilidade com ReactWrapper
Esta implementação segue todas as regras do padrão ReactWrapper:
- ✅ Hooks apenas em `setupHooks()` (se necessário)
- ✅ `updateView()` após mutações (nos componentes filhos)
- ✅ Não há necessidade de `.bind(this)` (rebind automático)
- ✅ Lifecycle hooks utilizados corretamente (`onInit()`)
- ✅ Estado mutável gerenciado via Proxy

## 🚀 Resultado Final

Uma aplicação de formulário:
- **Mais rápida**: Menos re-renders durante digitação
- **Mais escalável**: Fácil adicionar novos campos/seções
- **Mais manutenível**: Responsabilidades claras e isoladas
- **Mais testável**: Cada componente pode ser testado independentemente
