import { ReactWrapper } from "@lotexiu/react/components/implementations";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { SaveIcon, XIcon } from "lucide-react";

interface DockerContainerCreateActionsProps {
	loading: boolean;
	onReset: () => void;
}

export const DockerContainerCreateActions = ReactWrapper(
	class DockerContainerCreateActions extends ReactWrapper.Client<DockerContainerCreateActionsProps> {
		render(): ReactNode | Promise<ReactNode> {
			const { loading, onReset } = this.props;

			return (
				<div className="flex items-center justify-end gap-4 pt-4 border-t">
					<Button
						type="button"
						variant="outline"
						onClick={onReset}
						disabled={loading}
					>
						<XIcon />
						Limpar Formulário
					</Button>

					<Button type="submit" disabled={loading}>
						{loading ? (
							<>
								<Spinner />
								Criando...
							</>
						) : (
							<>
								<SaveIcon />
								Criar Container
							</>
						)}
					</Button>
				</div>
			);
		}
	},
);
