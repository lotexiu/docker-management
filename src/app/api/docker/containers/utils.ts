import Docker from 'dockerode';
import type Dockerode from 'dockerode';
import { ContainerResponse } from './types';

// Singleton Docker instance
let dockerInstance: Docker | null = null;

export function getDockerInstance(): Docker {
  if (!dockerInstance) {
    dockerInstance = new Docker({ socketPath: '/var/run/docker.sock' });
  }
  return dockerInstance;
}

// Formata informações do container para resposta
export function formatContainerInfo(containerInfo: Dockerode.ContainerInfo): ContainerResponse {
  return {
    id: containerInfo.Id,
    name: containerInfo.Names?.[0]?.replace(/^\//, '') || '',
    image: containerInfo.Image,
    status: containerInfo.Status,
    state: containerInfo.State,
    created: containerInfo.Created,
    ports: containerInfo.Ports,
    labels: containerInfo.Labels,
  };
}

// Formata informações detalhadas do container
export function formatContainerInspect(inspect: Dockerode.ContainerInspectInfo): ContainerResponse {
  return {
    id: inspect.Id,
    name: inspect.Name.replace(/^\//, ''),
    image: inspect.Config.Image,
    status: inspect.State.Status,
    state: inspect.State.Status,
    created: new Date(inspect.Created).getTime() / 1000,
    labels: inspect.Config.Labels,
  };
}

// Helper para criar resposta de erro
export function createErrorResponse(error: unknown, message = 'Erro ao processar requisição') {
  console.error(message, error);

  const errorMessage = error instanceof Error ? error.message : String(error);

  return Response.json(
    {
      success: false,
      error: errorMessage,
      message,
    },
    { status: 500 }
  );
}

// Helper para criar resposta de sucesso
export function createSuccessResponse<T>(data: T, message?: string, status = 200) {
  return Response.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

// Helper para criar resposta de validação
export function createValidationErrorResponse(error: string) {
  return Response.json(
    {
      success: false,
      error,
      message: 'Erro de validação',
    },
    { status: 400 }
  );
}
