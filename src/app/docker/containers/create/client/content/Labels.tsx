import { ReactWrapper } from "@lotexiu/react/components/implementations";
import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, XIcon } from "lucide-react";
import { LabelEntry } from "../../types";

interface DockerContainerCreateLabelsProps {
	labels: LabelEntry[];
	onAdd: () => void;
	onUpdate: (index: number, field: keyof LabelEntry, value: string) => void;
	onRemove: (index: number) => void;
}

export const DockerContainerCreateLabels = ReactWrapper(
	class DockerContainerCreateLabels extends ReactWrapper.Client<DockerContainerCreateLabelsProps> {
		render(): ReactNode | Promise<ReactNode> {
			const { labels, onAdd, onUpdate, onRemove } = this.props;

			return (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold">Labels</h3>
						<Button type="button" variant="outline" size="sm" onClick={onAdd}>
							<PlusCircleIcon />
							Adicionar Label
						</Button>
					</div>

					{labels.length === 0 && (
						<p className="text-sm text-foreground">Nenhum label configurado.</p>
					)}

					{labels.map((label, index) => (
						<div key={index} className="flex items-end gap-2">
							<div className="flex-1 space-y-2">
								<Label>Chave</Label>
								<Input
									placeholder="app.name"
									value={label.key}
									onChange={(e) => onUpdate(index, "key", e.target.value)}
								/>
							</div>

							<div className="flex-1 space-y-2">
								<Label>Valor</Label>
								<Input
									placeholder="my-app"
									value={label.value}
									onChange={(e) => onUpdate(index, "value", e.target.value)}
								/>
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
