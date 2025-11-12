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

interface DockerContainerCreateAdvancedProps {
	memory: string;
	cpuShares: string;
	restartPolicy: "" | "always" | "unless-stopped" | "on-failure";
	networkMode: string;
	onFieldChange: (field: string, value: any) => void;
}

export const DockerContainerCreateAdvanced = ReactWrapper(
	class DockerContainerCreateAdvanced extends ReactWrapper.ClientComponent<DockerContainerCreateAdvancedProps> {
		render(): ReactNode | Promise<ReactNode> {
			const { memory, cpuShares, restartPolicy, networkMode, onFieldChange } =
				this.props;

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
								value={memory}
								onChange={(e) => onFieldChange("memory", e.target.value)}
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
								value={cpuShares}
								onChange={(e) => onFieldChange("cpuShares", e.target.value)}
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
								value={restartPolicy || undefined}
								onValueChange={(value) => onFieldChange("restartPolicy", value)}
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
								value={networkMode}
								onChange={(e) => onFieldChange("networkMode", e.target.value)}
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
