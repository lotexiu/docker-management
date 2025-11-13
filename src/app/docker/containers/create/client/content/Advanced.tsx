import { ReactWrapper } from "@lotexiu/react/components/implementations";
import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AdvancedFieldsData, FormDataProvider } from "../../types";

interface DockerContainerCreateAdvancedProps {
	onInstanceReady?: (instance: FormDataProvider<AdvancedFieldsData>) => void;
}

export const DockerContainerCreateAdvanced = ReactWrapper(
	class DockerContainerCreateAdvanced
		extends ReactWrapper.Client<DockerContainerCreateAdvancedProps>
		implements FormDataProvider<AdvancedFieldsData>
	{
		// Estado local
		memory: string = "";
		cpuShares: string = "";
		restartPolicy: "" | "always" | "unless-stopped" | "on-failure" = "";
		networkMode: string = "";

		onInit(): void {
			// Notifica o pai que a instância está pronta
			this.props.onInstanceReady?.(this);
		}

		// Método para expor os dados
		getData(): AdvancedFieldsData {
			return {
				memory: this.memory,
				cpuShares: this.cpuShares,
				restartPolicy: this.restartPolicy,
				networkMode: this.networkMode,
			};
		}

		reset(): void {
			this.memory = "";
			this.cpuShares = "";
			this.restartPolicy = "";
			this.networkMode = "";
			this.updateView();
		}

		render(): ReactNode {
			return (
				<div className="space-y-4">
					<h3 className="text-lg font-semibold">Configurações Avançadas</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="memory">Memória (bytes)</Label>
							<Input
								id="memory"
								type="number"
								placeholder="536870912"
								value={this.memory}
								onChange={(e) => {
									this.memory = e.target.value;
									this.updateView();
								}}
							/>
							<p className="text-xs text-foreground">
								Limite de memória em bytes (ex: 536870912 = 512MB)
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="cpuShares">CPU Shares</Label>
							<Input
								id="cpuShares"
								type="number"
								placeholder="1024"
								value={this.cpuShares}
								onChange={(e) => {
									this.cpuShares = e.target.value;
									this.updateView();
								}}
							/>
							<p className="text-xs text-foreground">
								Peso de CPU (padrão: 1024)
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="restartPolicy">Política de Reinício</Label>
							<Select
								value={this.restartPolicy || undefined}
								onValueChange={(value) => {
									this.restartPolicy = value as typeof this.restartPolicy;
									this.updateView();
								}}
							>
								<SelectTrigger id="restartPolicy">
									<SelectValue placeholder="Nenhuma (padrão)" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="always">Always</SelectItem>
									<SelectItem value="unless-stopped">Unless Stopped</SelectItem>
									<SelectItem value="on-failure">On Failure</SelectItem>
								</SelectContent>
							</Select>
							<p className="text-xs text-foreground">
								Quando reiniciar o container automaticamente
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="networkMode">Modo de Rede</Label>
							<Input
								id="networkMode"
								placeholder="bridge"
								value={this.networkMode}
								onChange={(e) => {
									this.networkMode = e.target.value;
									this.updateView();
								}}
							/>
							<p className="text-xs text-foreground">
								Modo de rede (bridge, host, none, etc.)
							</p>
						</div>
					</div>
				</div>
			);
		}
	},
);
