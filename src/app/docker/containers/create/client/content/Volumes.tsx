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
import { VolumeMount } from "../../types";

interface DockerContainerCreateVolumesProps {
	volumes: VolumeMount[];
	onAdd: () => void;
	onUpdate: (index: number, field: keyof VolumeMount, value: string) => void;
	onRemove: (index: number) => void;
}

export const DockerContainerCreateVolumes = ReactWrapper(
	class DockerContainerCreateVolumes extends ReactWrapper.Client<DockerContainerCreateVolumesProps> {
		render(): ReactNode | Promise<ReactNode> {
			const { volumes, onAdd, onUpdate, onRemove } = this.props;

			return (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold">Volumes</h3>
						<Button type="button" variant="outline" size="sm" onClick={onAdd}>
							<PlusCircleIcon />
							Adicionar Volume
						</Button>
					</div>

					{volumes.length === 0 && (
						<p className="text-sm text-foreground">
							Nenhum volume configurado.
						</p>
					)}

					{volumes.map((volume, index) => (
						<div key={index} className="flex items-end gap-2">
							<div className="flex-1 space-y-2">
								<Label>Caminho no Host</Label>
								<Input
									placeholder="/path/on/host"
									value={volume.hostPath}
									onChange={(e) => onUpdate(index, "hostPath", e.target.value)}
								/>
							</div>

							<div className="flex-1 space-y-2">
								<Label>Caminho no Container</Label>
								<Input
									placeholder="/path/in/container"
									value={volume.containerPath}
									onChange={(e) =>
										onUpdate(index, "containerPath", e.target.value)
									}
								/>
							</div>

							<div className="w-32 space-y-2">
								<Label>Modo</Label>
								<Select
									value={volume.mode || "rw"}
									onValueChange={(value) => onUpdate(index, "mode", value)}
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
