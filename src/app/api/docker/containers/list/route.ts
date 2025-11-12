import { NextRequest } from "next/server";
import type Dockerode from "dockerode";
import { listContainersSchema } from "../validation";
import Docker from "dockerode";

import {
	getDockerInstance,
	formatContainerInfo,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "../utils";
import type { ListContainersResponse } from "../types";
import { clear } from "console";

// GET - Listar containers com paginação
export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		// Extrair parâmetros da query
		const queryParams = {
			page: searchParams.get("page") || "1",
			pageSize: searchParams.get("pageSize") || "10",
			all: searchParams.get("all") || "true",
			filters: searchParams.get("filters"),
		};

		// Validar entrada
		const validation = listContainersSchema.safeParse(queryParams);
		if (!validation.success) {
			console.log(queryParams);
			return createValidationErrorResponse(
				validation.error.issues[0]?.message || "Parâmetros inválidos",
			);
		}

		const data = validation.data;

		const docker = getDockerInstance();

		// Preparar opções para listar containers
		const listOptions: any = {
			all: data.all,
		};

		// Adicionar filtros se fornecidos
		if (data.filters) {
			try {
				listOptions.filters = JSON.parse(data.filters);
			} catch (error) {
				return createValidationErrorResponse(
					"Formato de filtros inválido (deve ser JSON válido)",
				);
			}
		}

		// Obter todos os containers que correspondem aos filtros
		const allContainers: Dockerode.ContainerInfo[] =
			await (docker.listContainers(listOptions) as any);

		// Calcular paginação
		const total = allContainers.length;
		const totalPages = Math.ceil(total / data.pageSize);
		const startIndex = (data.page - 1) * data.pageSize;
		const endIndex = startIndex + data.pageSize;

		// Aplicar paginação
		const paginatedContainers = allContainers.slice(startIndex, endIndex);

		// Formatar resposta
		const response: ListContainersResponse = {
			containers: paginatedContainers.map(formatContainerInfo),
			pagination: {
				page: data.page,
				pageSize: data.pageSize,
				total,
				totalPages,
			},
		};

		return createSuccessResponse(response, "Containers listados com sucesso");
	} catch (error) {
		return createErrorResponse(error, "Erro ao listar containers");
	}
}
