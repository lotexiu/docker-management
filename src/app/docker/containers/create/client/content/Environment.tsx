import { ReactWrapper } from "@lotexiu/react/components/implementations";
import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, XIcon } from "lucide-react";
import { EnvironmentVariable } from "../../types";

interface DockerContainerCreateEnvironmentProps {
	envVars: EnvironmentVariable[];
	onAdd: () => void;
	onUpdate: (
		index: number,
		field: keyof EnvironmentVariable,
		value: string,
	) => void;
	onRemove: (index: number) => void;
}

export const DockerContainerCreateEnvironment = ReactWrapper(
	class DockerContainerCreateEnvironment extends ReactWrapper.Client<DockerContainerCreateEnvironmentProps> {
		render(): ReactNode | Promise<ReactNode> {
			const { envVars, onAdd, onUpdate, onRemove } = this.props;

			return (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold">Variáveis de Ambiente</h3>
						<Button type="button" variant="outline" size="sm" onClick={onAdd}>
							<PlusCircleIcon />
							Adicionar Variável
						</Button>
					</div>

					{envVars.length === 0 && (
						<p className="text-sm text-foreground">
							Nenhuma variável de ambiente configurada.
						</p>
					)}

					{envVars.map((env, index) => (
						<div key={index} className="flex items-end gap-2">
							<div className="flex-1 space-y-2">
								<Label>Chave</Label>
								<Input
									placeholder="NODE_ENV"
									value={env.key}
									onChange={(e) => onUpdate(index, "key", e.target.value)}
								/>
							</div>

							<div className="flex-1 space-y-2">
								<Label>Valor</Label>
								<Input
									placeholder="production"
									value={env.value}
									onChange={(e) => onUpdate(index, "value", e.target.value)}
								/>
							</div>

							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => onRemove(index)}
								className="text-red-600 hover:text-red-700 hover:bg-red-50"
							>
								<XIcon />
							</Button>
						</div>
					))}
				</div>
			);
		}
	},
);
