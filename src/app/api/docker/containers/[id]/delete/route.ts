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

		// Verificar se o container existe e obter informações da imagem
		let imageId: string | undefined;
		try {
			const containerInfo = await container.inspect();
			imageId = containerInfo.Image; // ID da imagem usada pelo container
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

		// Tentar remover a imagem se não houver outros containers usando-a
		let imageRemoved = false;
		if (imageId) {
			try {
				// Listar todos os containers (incluindo parados)
				const allContainers = await docker.listContainers({ all: true });

				// Verificar se algum outro container usa a mesma imagem
				const containersUsingImage = allContainers.filter(
					(c) => c.ImageID === imageId || c.Image === imageId
				);

				// Se nenhum container estiver usando a imagem, removê-la
				if (containersUsingImage.length === 0) {
					console.log(`Nenhum container usando a imagem ${imageId}, removendo...`);
					const image = docker.getImage(imageId);
					await image.remove({ force: false });
					imageRemoved = true;
					console.log(`Imagem ${imageId} removida com sucesso`);
				} else {
					console.log(`Imagem ${imageId} ainda está sendo usada por ${containersUsingImage.length} container(s), mantendo...`);
				}
			} catch (imageError: any) {
				// Se houver erro ao remover a imagem, apenas logar mas não falhar a requisição
				console.error(`Erro ao tentar remover imagem ${imageId}:`, imageError.message || imageError);
				// Não retornar erro, pois o container foi removido com sucesso
			}
		}

		return createSuccessResponse(
			{
				id,
				imageRemoved,
				imageId: imageRemoved ? imageId : undefined
			},
			imageRemoved
				? "Container e imagem removidos com sucesso"
				: "Container removido com sucesso"
		);
	} catch (error) {
		return createErrorResponse(error, "Erro ao remover container");
	}
}
