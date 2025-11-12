import { ReactWrapper } from "@lotexiu/react/components/implementations";
import { ReactNode } from "react";
import { AlertCircleIcon, CheckCircleIcon } from "lucide-react";

interface DockerContainerCreateMessagesProps {
	error: string | null;
	successMessage: string | null;
}

export const DockerContainerCreateMessages = ReactWrapper(
	class DockerContainerCreateMessages extends ReactWrapper.ClientComponent<DockerContainerCreateMessagesProps> {
		render(): ReactNode | Promise<ReactNode> {
			const { error, successMessage } = this.props;

			return (
				<>
					{error && (
						<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-800">
							<AlertCircleIcon className="size-5" />
							<span>{error}</span>
						</div>
					)}

					{successMessage && (
						<div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-800">
							<CheckCircleIcon className="size-5" />
							<span>{successMessage}</span>
						</div>
					)}
				</>
			);
		}
	},
);
