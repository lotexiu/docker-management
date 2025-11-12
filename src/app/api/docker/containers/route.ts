import { NextRequest } from 'next/server';
import type Dockerode from 'dockerode';
import { createContainerSchema } from './validation';
import {
  getDockerInstance,
  createErrorResponse,
  createSuccessResponse,
  createValidationErrorResponse,
} from './utils';

// POST - Criar novo container
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar entrada
    const validation = createContainerSchema.safeParse(body);
    if (!validation.success) {
      return createValidationErrorResponse(validation.error.issues[0]?.message || 'Dados inválidos');
    }

    const data = validation.data;
    const docker = getDockerInstance();

    // Verificar se a imagem existe localmente, se não, fazer pull
    try {
      await docker.getImage(data.image).inspect();
      console.log(`Imagem ${data.image} já existe localmente`);
    } catch (imageError: any) {
      // Imagem não existe, fazer pull
      if (imageError.statusCode === 404) {
        console.log(`Imagem ${data.image} não encontrada, fazendo pull...`);

        try {
          // Fazer pull da imagem
          await new Promise<void>((resolve, reject) => {
            docker.pull(data.image, (err: any, stream: any) => {
              if (err) {
                reject(err);
                return;
              }

              // Acompanhar o progresso do pull
              docker.modem.followProgress(
                stream,
                (err: any, output: any) => {
                  if (err) {
                    reject(err);
                  } else {
                    console.log(`Pull da imagem ${data.image} concluído com sucesso`);
                    resolve();
                  }
                },
                (event: any) => {
                  // Log opcional do progresso
                  if (event.status) {
                    console.log(`${event.status}${event.progress ? `: ${event.progress}` : ''}`);
                  }
                }
              );
            });
          });
        } catch (pullError) {
          return createErrorResponse(
            pullError,
            `Erro ao fazer pull da imagem ${data.image}. Verifique se a imagem existe no Docker Hub.`
          );
        }
      } else {
        // Outro erro ao inspecionar a imagem
        return createErrorResponse(imageError, 'Erro ao verificar imagem');
      }
    }

    // Mapear configurações para o formato correto do Docker API
    const createOptions: Dockerode.ContainerCreateOptions = {
      name: data.name,
      Image: data.image,
      Cmd: data.cmd,
      Env: data.env,
      ExposedPorts: data.exposedPorts,
      Labels: data.labels,
      WorkingDir: data.workingDir,
      User: data.user,
      AttachStdin: data.attachStdin,
      AttachStdout: data.attachStdout,
      AttachStderr: data.attachStderr,
      Tty: data.tty,
      OpenStdin: data.openStdin,
      StdinOnce: data.stdinOnce,
    };

    if (data.hostConfig) {
      createOptions.HostConfig = {
        Binds: data.hostConfig.binds,
        Memory: data.hostConfig.memory,
        MemorySwap: data.hostConfig.memorySwap,
        CpuShares: data.hostConfig.cpuShares,
        NetworkMode: data.hostConfig.networkMode,
      };

      if (data.hostConfig.portBindings) {
        createOptions.HostConfig.PortBindings = data.hostConfig.portBindings as any;
      }

      if (data.hostConfig.restartPolicy) {
        createOptions.HostConfig.RestartPolicy = {
          Name: data.hostConfig.restartPolicy.name || '',
          MaximumRetryCount: data.hostConfig.restartPolicy.maximumRetryCount,
        };
      }
    }

    if (data.networkingConfig?.endpointsConfig) {
      createOptions.NetworkingConfig = {
        EndpointsConfig: data.networkingConfig.endpointsConfig as any,
      };
    }

    // Criar container
    const container = await docker.createContainer(createOptions);

    // Obter informações do container criado
    const info = await container.inspect();

    return createSuccessResponse(
      {
        id: info.Id,
        name: info.Name.replace(/^\//, ''),
        image: info.Config.Image,
        status: info.State.Status,
        created: info.Created,
      },
      'Container criado com sucesso',
      201
    );
  } catch (error) {
    return createErrorResponse(error, 'Erro ao criar container');
  }
}
