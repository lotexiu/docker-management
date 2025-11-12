import { ReactWrapper } from "@lotexiu/react/components/implementations";
import { AlertCircleIcon } from "lucide-react";
import { ReactNode } from "react";

interface DockerContainersListErrorProps {
	error: string | null;
}

export const DockerContainersListError = ReactWrapper(
	class DockerContainersListError extends ReactWrapper.ClientComponent<DockerContainersListErrorProps> {
		render(): ReactNode | Promise<ReactNode> {
			const { error } = this.props;

			return (
				<>
					{/* Erro */}
					{error && (
						<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-800">
							<AlertCircleIcon className="size-5" />
							<span>{error}</span>
						</div>
					)}
				</>
			);
		}
	},
);
