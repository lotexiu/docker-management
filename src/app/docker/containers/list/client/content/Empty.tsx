import { ReactWrapper } from "@lotexiu/react/components/implementations";
import { ReactNode } from "react";
import { ContainerData } from "../../types";
import { Container } from "lucide-react";

interface DockerContainersListEmptyProps {
	loading: boolean;
	containers: ContainerData[];
}

export const DockerContainersListEmpty = ReactWrapper(
	class DockerContainersListEmpty extends ReactWrapper.Client<DockerContainersListEmptyProps> {
		render(): ReactNode | Promise<ReactNode> {
			const { loading, containers } = this.props;

			return (
				<>
					{/* Vazio */}
					{!loading && containers.length === 0 && (
						<div className="flex flex-col items-center justify-center py-12 text-foreground">
							<Container className="size-12 mb-4 opacity-50" />
							<p className="text-lg font-medium">Nenhum container encontrado</p>
							<p className="text-sm">Crie um novo container para começar</p>
						</div>
					)}
				</>
			);
		}
	},
);
