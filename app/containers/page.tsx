import { ContainerInfo } from "dockerode";
import { DockerContainerPageContent } from "./ClientRendering/page-content";

/* Server side rendering */
export default async function DockerContainersPage() {
	// Em server components do Next.js, não é possível usar uma URL relativa como '/api/docker'
	// porque o fetch roda no servidor e precisa de uma URL absoluta.
	// Aqui construímos a base a partir de uma variável de ambiente ou do localhost padrão.
	// Alternativa (mais eficiente): importar a lógica do handler server-side diretamente
	// em vez de fazer um fetch HTTP interno.

	// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
	// const response = await fetch(new URL("/api/docker", baseUrl).toString());
	// const containers: ContainerInfo[] = await response.json();

	const containers: ContainerInfo[] = []

	return (
		<div>
			<DockerContainerPageContent containers={containers}></DockerContainerPageContent>
		</div>
	);
}