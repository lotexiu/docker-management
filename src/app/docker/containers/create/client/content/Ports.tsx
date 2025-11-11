import { ReactWrapper } from '@lotexiu/react/components/implementations';
import { ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { PlusCircleIcon, XIcon } from 'lucide-react';
import { PortMapping } from '../../types';

interface DockerContainerCreatePortsProps {
	ports: PortMapping[];
	onAdd: () => void;
	onUpdate: (index: number, field: keyof PortMapping, value: string) => void;
	onRemove: (index: number) => void;
}

export const DockerContainerCreatePorts = ReactWrapper(
	class DockerContainerCreatePorts extends ReactWrapper.ClientComponent<DockerContainerCreatePortsProps> {
		render(): ReactNode | Promise<ReactNode> {
			const { ports, onAdd, onUpdate, onRemove } = this.props;

			return (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold">Mapeamento de Portas</h3>
						<Button type="button" variant="outline" size="sm" onClick={onAdd}>
							<PlusCircleIcon />
							Adicionar Porta
						</Button>
					</div>

					{ports.length === 0 && (
						<p className="text-sm text-foreground">
							Nenhuma porta configurada. Clique em "Adicionar Porta" para mapear portas.
						</p>
					)}

					{ports.map((port, index) => (
						<div key={index} className="flex items-end gap-2">
							<div className="flex-1 space-y-2">
								<Label>Porta do Container</Label>
								<Input
									type="number"
									placeholder="80"
									value={port.containerPort}
									onChange={(e) =>
										onUpdate(index, 'containerPort', e.target.value)
									}
								/>
							</div>

							<div className="flex-1 space-y-2">
								<Label>Porta do Host</Label>
								<Input
									type="number"
									placeholder="8080"
									value={port.hostPort}
									onChange={(e) => onUpdate(index, 'hostPort', e.target.value)}
								/>
							</div>

							<div className="w-32 space-y-2">
								<Label>Protocolo</Label>
								<Select
									value={port.protocol}
									onValueChange={(value) =>
										onUpdate(index, 'protocol', value)
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
	}
);
