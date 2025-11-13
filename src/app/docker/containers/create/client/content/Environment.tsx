import { ReactWrapper } from "@lotexiu/react/components/implementations";
import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, XIcon } from "lucide-react";
import { EnvironmentVariable, FormDataProvider } from "../../types";

interface DockerContainerCreateEnvironmentProps {
	onInstanceReady?: (instance: FormDataProvider<EnvironmentVariable[]>) => void;
}

export const DockerContainerCreateEnvironment = ReactWrapper(
	class DockerContainerCreateEnvironment
		extends ReactWrapper.Client<DockerContainerCreateEnvironmentProps>
		implements FormDataProvider<EnvironmentVariable[]>
	{
		// Estado local
		envVars: EnvironmentVariable[] = [];

		onInit(): void {
			// Notifica o pai que a instância está pronta
			this.props.onInstanceReady?.(this);
		}

		// Métodos de manipulação local
		addEnvVar() {
			this.envVars.push({ key: "", value: "" });
			this.updateView();
		}

		updateEnvVar(
			index: number,
			field: keyof EnvironmentVariable,
			value: string,
		) {
			if (this.envVars[index]) {
				this.envVars[index][field] = value;
				this.updateView();
			}
		}

		removeEnvVar(index: number) {
			this.envVars.splice(index, 1);
			this.updateView();
		}

		// Método para expor os dados
		getData(): EnvironmentVariable[] {
			return this.envVars;
		}

		reset(): void {
			this.envVars = [];
			this.updateView();
		}

		render(): ReactNode {
			return (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold">Variáveis de Ambiente</h3>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={this.addEnvVar}
						>
							<PlusCircleIcon />
							Adicionar Variável
						</Button>
					</div>

					{this.envVars.length === 0 && (
						<p className="text-sm text-foreground">
							Nenhuma variável de ambiente configurada.
						</p>
					)}

					{this.envVars.map((env, index) => (
						<div key={index} className="flex items-end gap-2">
							<div className="flex-1 space-y-2">
								<Label>Chave</Label>
								<Input
									placeholder="NODE_ENV"
									value={env.key}
									onChange={(e) =>
										this.updateEnvVar(index, "key", e.target.value)
									}
								/>
							</div>

							<div className="flex-1 space-y-2">
								<Label>Valor</Label>
								<Input
									placeholder="production"
									value={env.value}
									onChange={(e) =>
										this.updateEnvVar(index, "value", e.target.value)
									}
								/>
							</div>

							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => this.removeEnvVar(index)}
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
