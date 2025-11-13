import { ReactWrapper } from "@lotexiu/react/components/implementations";
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
import { VolumeMount, FormDataProvider } from "../../types";

interface DockerContainerCreateVolumesProps {
	onInstanceReady?: (instance: FormDataProvider<VolumeMount[]>) => void;
}

export const DockerContainerCreateVolumes = ReactWrapper(
	class DockerContainerCreateVolumes
		extends ReactWrapper.Client<DockerContainerCreateVolumesProps>
		implements FormDataProvider<VolumeMount[]>
	{
		// Estado local
		volumes: VolumeMount[] = [];

		onInit(): void {
			// Notifica o pai que a instância está pronta
			this.props.onInstanceReady?.(this);
		}

		// Métodos de manipulação local
		addVolume() {
			this.volumes.push({ hostPath: "", containerPath: "", mode: "rw" });
			this.updateView();
		}

		updateVolume(index: number, field: keyof VolumeMount, value: string) {
			if (this.volumes[index]) {
				this.volumes[index][field] = value as any;
				this.updateView();
			}
		}

		removeVolume(index: number) {
			this.volumes.splice(index, 1);
			this.updateView();
		}

		// Método para expor os dados
		getData(): VolumeMount[] {
			return this.volumes;
		}

		reset(): void {
			this.volumes = [];
			this.updateView();
		}

		render(): ReactNode {
			return (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold">Volumes</h3>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={this.addVolume}
						>
							<PlusCircleIcon />
							Adicionar Volume
						</Button>
					</div>

					{this.volumes.length === 0 && (
						<p className="text-sm text-foreground">
							Nenhum volume configurado.
						</p>
					)}

					{this.volumes.map((volume, index) => (
						<div key={index} className="flex items-end gap-2">
							<div className="flex-1 space-y-2">
								<Label>Caminho no Host</Label>
								<Input
									placeholder="/path/on/host"
									value={volume.hostPath}
									onChange={(e) =>
										this.updateVolume(index, "hostPath", e.target.value)
									}
								/>
							</div>

							<div className="flex-1 space-y-2">
								<Label>Caminho no Container</Label>
								<Input
									placeholder="/path/in/container"
									value={volume.containerPath}
									onChange={(e) =>
										this.updateVolume(index, "containerPath", e.target.value)
									}
								/>
							</div>

							<div className="w-32 space-y-2">
								<Label>Modo</Label>
								<Select
									value={volume.mode || "rw"}
									onValueChange={(value) =>
										this.updateVolume(index, "mode", value)
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="rw">Leitura/Escrita</SelectItem>
										<SelectItem value="ro">Somente Leitura</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => this.removeVolume(index)}
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
