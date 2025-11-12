import { NextRequest } from "next/server";
import {
	getDockerInstance,
	createErrorResponse,
	createSuccessResponse,
} from "../../utils";

// DELETE - Deletar container por ID
export async function DELETE(
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

		// Parâmetros opcionais da query
		const searchParams = request.nextUrl.searchParams;
		const force = searchParams.get("force") === "true";
		const removeVolumes = searchParams.get("v") === "true";

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
						error: "Container não encontrado",
						message: "Container não existe",
					},
					{ status: 404 },
				);
			}
			throw error;
		}

		// Remover container
		await container.remove({ force, v: removeVolumes });

		return createSuccessResponse({ id }, "Container removido com sucesso");
	} catch (error) {
		return createErrorResponse(error, "Erro ao remover container");
	}
}
