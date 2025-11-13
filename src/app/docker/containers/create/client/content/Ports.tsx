import { ReactWrapper } from "../../../../../../../../../packages/react/dist/components/implementations";
import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { PlusCircleIcon, XIcon } from "lucide-react";
import { PortMapping, FormDataProvider } from "../../types";

interface DockerContainerCreatePortsProps {
	onInstanceReady?: (instance: FormDataProvider<PortMapping[]>) => void;
}

export const DockerContainerCreatePorts = ReactWrapper(
	class DockerContainerCreatePorts
		extends ReactWrapper.Client<DockerContainerCreatePortsProps>
		implements FormDataProvider<PortMapping[]>
	{
		// Estado local
		ports: PortMapping[] = [];

		onInit(): void {
			// Notifica o pai que a instância está pronta
			this.props.onInstanceReady?.(this);
		}

		// Métodos de manipulação local
		addPort() {
			this.ports.push({ containerPort: "", hostPort: "", protocol: "tcp" });
			this.updateView();
		}

		updatePort(index: number, field: keyof PortMapping, value: string) {
			if (this.ports[index]) {
				this.ports[index][field] = value as any;
				this.updateView();
			}
		}

		removePort(index: number) {
			this.ports.splice(index, 1);
			this.updateView();
		}

		// Método para expor os dados
		getData(): PortMapping[] {
			return this.ports;
		}

		reset(): void {
			this.ports = [];
			this.updateView();
		}

		render(): ReactNode {
			return (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold">Mapeamento de Portas</h3>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={this.addPort}
						>
							<PlusCircleIcon />
							Adicionar Porta
						</Button>
					</div>

					{this.ports.length === 0 && (
						<p className="text-sm text-foreground">
							Nenhuma porta configurada. Clique em "Adicionar Porta" para mapear
							portas.
						</p>
					)}

					{this.ports.map((port, index) => (
						<div key={index} className="flex items-end gap-2">
							<div className="flex-1 space-y-2">
								<Label>Porta do Container</Label>
								<Input
									type="number"
									placeholder="80"
									value={port.containerPort}
									onChange={(e) =>
										this.updatePort(index, "containerPort", e.target.value)
									}
								/>
							</div>

							<div className="flex-1 space-y-2">
								<Label>Porta do Host</Label>
								<Input
									type="number"
									placeholder="8080"
									value={port.hostPort}
									onChange={(e) =>
										this.updatePort(index, "hostPort", e.target.value)
									}
								/>
							</div>

							<div className="w-32 space-y-2">
								<Label>Protocolo</Label>
								<Select
									value={port.protocol}
									onValueChange={(value) =>
										this.updatePort(index, "protocol", value)
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="tcp">TCP</SelectItem>
										<SelectItem value="udp">UDP</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => this.removePort(index)}
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
