import { ReactWrapper } from '@lotexiu/react/components/implementations';
import { ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';

interface DockerContainerCreateBasicFieldsProps {
	name: string;
	image: string;
	cmd: string;
	workingDir: string;
	user: string;
	tty: boolean;
	onFieldChange: (field: string, value: any) => void;
}

export const DockerContainerCreateBasicFields = ReactWrapper(
	class DockerContainerCreateBasicFields extends ReactWrapper.ClientComponent<DockerContainerCreateBasicFieldsProps> {
		render(): ReactNode | Promise<ReactNode> {
			const { name, image, cmd, workingDir, user, tty, onFieldChange } =
				this.props;

			return (
				<div className="space-y-4">
					<h3 className="text-lg font-semibold">Informações Básicas</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="image">
								Imagem <span className="text-red-500">*</span>
							</Label>
							<Input
								id="image"
								placeholder="nginx:latest"
								value={image}
								onChange={(e) => onFieldChange('image', e.target.value)}
								required
							/>
							<p className="text-xs text-foreground">
								Nome da imagem Docker (obrigatório)
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="name">Nome do Container</Label>
							<Input
								id="name"
								placeholder="meu-container"
								value={name}
								onChange={(e) => onFieldChange('name', e.target.value)}
							/>
							<p className="text-xs text-foreground">
								Nome personalizado (opcional)
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="cmd">Comando</Label>
							<Input
								id="cmd"
								placeholder="npm start"
								value={cmd}
								onChange={(e) => onFieldChange('cmd', e.target.value)}
							/>
							<p className="text-xs text-foreground">
								Comando a ser executado (opcional)
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="workingDir">Diretório de Trabalho</Label>
							<Input
								id="workingDir"
								placeholder="/app"
								value={workingDir}
								onChange={(e) => onFieldChange('workingDir', e.target.value)}
							/>
							<p className="text-xs text-foreground">
								Working directory (opcional)
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="user">Usuário</Label>
							<Input
								id="user"
								placeholder="root"
								value={user}
								onChange={(e) => onFieldChange('user', e.target.value)}
							/>
							<p className="text-xs text-foreground">
								Usuário para executar o container (opcional)
							</p>
						</div>

						<div className="space-y-2">
							<Label>Terminal Interativo (TTY)</Label>
							<div className="flex items-center gap-2">
								<Toggle
									pressed={tty}
									onPressedChange={(pressed) =>
										onFieldChange('tty', pressed)
									}
								>
									{tty ? 'Habilitado' : 'Desabilitado'}
								</Toggle>
							</div>
							<p className="text-xs text-foreground">
								Alocar um pseudo-TTY
							</p>
						</div>
					</div>
				</div>
			);
		}
	}
);
