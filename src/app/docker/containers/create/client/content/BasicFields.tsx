import { ReactWrapper } from "../../../../../../../../../packages/react/dist/components/implementations";
import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { BasicFieldsData, FormDataProvider } from "../../types";

interface DockerContainerCreateBasicFieldsProps {
	onInstanceReady?: (instance: FormDataProvider<BasicFieldsData>) => void;
}

export const DockerContainerCreateBasicFields = ReactWrapper(
	class DockerContainerCreateBasicFields
		extends ReactWrapper.Client<DockerContainerCreateBasicFieldsProps>
		implements FormDataProvider<BasicFieldsData>
	{
		// Estado local
		name: string = "";
		image: string = "";
		cmd: string = "";
		workingDir: string = "";
		user: string = "";
		tty: boolean = false;

		onInit(): void {
			// Notifica o pai que a instância está pronta
			this.props.onInstanceReady?.(this);
		}

		// Método para expor os dados
		getData(): BasicFieldsData {
			return {
				name: this.name,
				image: this.image,
				cmd: this.cmd,
				workingDir: this.workingDir,
				user: this.user,
				tty: this.tty,
			};
		}

		reset(): void {
			this.name = "";
			this.image = "";
			this.cmd = "";
			this.workingDir = "";
			this.user = "";
			this.tty = false;
			this.updateView();
		}

		render(): ReactNode {
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
								value={this.image}
								onChange={(e) => {
									this.image = e.target.value;
									this.updateView();
								}}
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
								value={this.name}
								onChange={(e) => {
									this.name = e.target.value;
									this.updateView();
								}}
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
								value={this.cmd}
								onChange={(e) => {
									this.cmd = e.target.value;
									this.updateView();
								}}
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
								value={this.workingDir}
								onChange={(e) => {
									this.workingDir = e.target.value;
									this.updateView();
								}}
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
								value={this.user}
								onChange={(e) => {
									this.user = e.target.value;
									this.updateView();
								}}
							/>
							<p className="text-xs text-foreground">
								Usuário para executar o container (opcional)
							</p>
						</div>

						<div className="space-y-2">
							<Label>Terminal Interativo (TTY)</Label>
							<div className="flex items-center gap-2">
								<Toggle
									pressed={this.tty}
									onPressedChange={(pressed) => {
										this.tty = pressed;
										this.updateView();
									}}
								>
									{this.tty ? "Habilitado" : "Desabilitado"}
								</Toggle>
							</div>
							<p className="text-xs text-foreground">Alocar um pseudo-TTY</p>
						</div>
					</div>
				</div>
			);
		}
	},
);
