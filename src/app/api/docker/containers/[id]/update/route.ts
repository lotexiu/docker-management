import { NextRequest } from 'next/server';
import { updateContainerSchema } from '../../validation';
import {
  getDockerInstance,
  formatContainerInspect,
  createErrorResponse,
  createSuccessResponse,
  createValidationErrorResponse,
} from '../../utils';

// PUT - Atualizar container por ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return createValidationErrorResponse('ID do container é obrigatório');
    }

    const body = await request.json();

    // Validar entrada
    const validation = updateContainerSchema.safeParse(body);
    if (!validation.success) {
      return createValidationErrorResponse(validation.error.issues[0]?.message || 'Dados inválidos');
    }

    const data = validation.data;
    const docker = getDockerInstance();
    const container = docker.getContainer(id);

    // Verificar se o container existe
    try {
      await container.inspect();
    } catch (error: any) {
      if (error.statusCode === 404) {
        return Response.json(
          {
            success: false,
            error: 'Container não encontrado',
            message: 'Container não existe',
          },
          { status: 404 }
        );
      }
      throw error;
    }

    // Executar ação solicitada
    let message = '';
    switch (data.action) {
      case 'start':
        await container.start();
        message = 'Container iniciado com sucesso';
        break;

      case 'pause':
        await container.pause();
        message = 'Container pausado com sucesso';
        break;

      case 'unpause':
        await container.unpause();
        message = 'Container retomado com sucesso';
        break;

      case 'restart':
        await container.restart();
        message = 'Container reiniciado com sucesso';
        break;

      case 'stop':
        await container.stop({ t: data.timeout });
        message = 'Container parado com sucesso';
        break;

      case 'rename':
        if (!data.name) {
          return createValidationErrorResponse('Nome é obrigatório para renomear');
        }
        await container.rename({ name: data.name });
        message = 'Container renomeado com sucesso';
        break;

      case 'update':
        if (!data.config) {
          return createValidationErrorResponse('Configuração é obrigatória para atualizar');
        }
        await container.update({
          CpuShares: data.config.cpuShares,
          Memory: data.config.memory,
          MemorySwap: data.config.memorySwap,
          MemoryReservation: data.config.memoryReservation,
          KernelMemory: data.config.kernelMemory,
          CpuPeriod: data.config.cpuPeriod,
          CpuQuota: data.config.cpuQuota,
          CpusetCpus: data.config.cpusetCpus,
          CpusetMems: data.config.cpusetMems,
          BlkioWeight: data.config.blkioWeight,
          RestartPolicy: data.config.restartPolicy,
        });
        message = 'Container atualizado com sucesso';
        break;

      default:
        return createValidationErrorResponse('Ação inválida');
    }

    // Obter informações atualizadas do container
    const info = await container.inspect();
    const formattedInfo = formatContainerInspect(info);

    return createSuccessResponse(formattedInfo, message);
  } catch (error) {
    return createErrorResponse(error, 'Erro ao atualizar container');
  }
}
