import { ReactWrapper } from "@lotexiu/react/components/implementations";
import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, XIcon } from "lucide-react";
import { LabelEntry, FormDataProvider } from "../../types";

interface DockerContainerCreateLabelsProps {
	onInstanceReady?: (instance: FormDataProvider<LabelEntry[]>) => void;
}

export const DockerContainerCreateLabels = ReactWrapper(
	class DockerContainerCreateLabels
		extends ReactWrapper.Client<DockerContainerCreateLabelsProps>
		implements FormDataProvider<LabelEntry[]>
	{
		// Estado local
		labels: LabelEntry[] = [];

		onInit(): void {
			// Notifica o pai que a instância está pronta
			this.props.onInstanceReady?.(this);
		}

		// Métodos de manipulação local
		addLabel() {
			this.labels.push({ key: "", value: "" });
			this.updateView();
		}

		updateLabel(index: number, field: keyof LabelEntry, value: string) {
			if (this.labels[index]) {
				this.labels[index][field] = value;
				this.updateView();
			}
		}

		removeLabel(index: number) {
			this.labels.splice(index, 1);
			this.updateView();
		}

		// Método para expor os dados
		getData(): LabelEntry[] {
			return this.labels;
		}

		reset(): void {
			this.labels = [];
			this.updateView();
		}

		render(): ReactNode {
			return (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold">Labels</h3>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={this.addLabel}
						>
							<PlusCircleIcon />
							Adicionar Label
						</Button>
					</div>

					{this.labels.length === 0 && (
						<p className="text-sm text-foreground">Nenhum label configurado.</p>
					)}

					{this.labels.map((label, index) => (
						<div key={index} className="flex items-end gap-2">
							<div className="flex-1 space-y-2">
								<Label>Chave</Label>
								<Input
									placeholder="app.name"
									value={label.key}
									onChange={(e) =>
										this.updateLabel(index, "key", e.target.value)
									}
								/>
							</div>

							<div className="flex-1 space-y-2">
								<Label>Valor</Label>
								<Input
									placeholder="my-app"
									value={label.value}
									onChange={(e) =>
										this.updateLabel(index, "value", e.target.value)
									}
								/>
							</div>

							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => this.removeLabel(index)}
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
