import { NextRequest } from "next/server";
import {
	getDockerInstance,
	formatContainerInspect,
	createErrorResponse,
	createSuccessResponse,
} from "../utils";

// GET - Obter container por ID
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		if (!id) {
			return Response.json(
				{
					success: false,
					error: "ID do container é obrigatório",
					message: "Erro de validação",
				},
				{ status: 400 },
			);
		}

		const docker = getDockerInstance();
		const container = docker.getContainer(id);

		// Obter informações detalhadas do container
		const info = await container.inspect();
		const formattedInfo = formatContainerInspect(info);

		return createSuccessResponse(formattedInfo, "Container encontrado");
	} catch (error: any) {
		if (error.statusCode === 404) {
			return Response.json(
				{
					success: false,
					error: "Container não encontrado",
					message: "Container não existe",
				},
				{ status: 404 },
			);
		}
		return createErrorResponse(error, "Erro ao obter container");
	}
}
