import { Card, CardContent } from "@/components/ui/card";
import { ReactWrapper } from "@lotexiu/react/components/implementations";
import { ReactNode } from "react";
import { DockerContainerCreateMessages } from "./Messages";
import { DockerContainerCreateBasicFields } from "./BasicFields";
import { DockerContainerCreatePorts } from "./Ports";
import { DockerContainerCreateEnvironment } from "./Environment";
import { DockerContainerCreateVolumes } from "./Volumes";
import { DockerContainerCreateLabels } from "./Labels";
import { DockerContainerCreateAdvanced } from "./Advanced";
import { DockerContainerCreateActions } from "./Actions";
import {
	PortMapping,
	EnvironmentVariable,
	VolumeMount,
	LabelEntry,
} from "../../types";

interface DockerContainerCreateContentProps {
	// Basic fields
	name: string;
	image: string;
	cmd: string;
	workingDir: string;
	user: string;
	tty: boolean;
	// Advanced fields
	memory: string;
	cpuShares: string;
	restartPolicy: "" | "always" | "unless-stopped" | "on-failure";
	networkMode: string;
	// Arrays
	ports: PortMapping[];
	envVars: EnvironmentVariable[];
	volumes: VolumeMount[];
	labels: LabelEntry[];
	// Handlers
	onFieldChange: (field: string, value: any) => void;
	onAddPort: () => void;
	onUpdatePort: (
		index: number,
		field: keyof PortMapping,
		value: string,
	) => void;
	onRemovePort: (index: number) => void;
	onAddEnvVar: () => void;
	onUpdateEnvVar: (
		index: number,
		field: keyof EnvironmentVariable,
		value: string,
	) => void;
	onRemoveEnvVar: (index: number) => void;
	onAddVolume: () => void;
	onUpdateVolume: (
		index: number,
		field: keyof VolumeMount,
		value: string,
	) => void;
	onRemoveVolume: (index: number) => void;
	onAddLabel: () => void;
	onUpdateLabel: (
		index: number,
		field: keyof LabelEntry,
		value: string,
	) => void;
	onRemoveLabel: (index: number) => void;
	onSubmit: () => void;
	onReset: () => void;
	// UI state
	loading: boolean;
	error: string | null;
	successMessage: string | null;
}

export const DockerContainerCreateContent = ReactWrapper(
	class DockerContainerCreateContent extends ReactWrapper.ClientComponent<DockerContainerCreateContentProps> {
		render(): ReactNode | Promise<ReactNode> {
			return (
				<Card className="mt-6">
					<CardContent>
						<DockerContainerCreateMessages
							error={this.props.error}
							successMessage={this.props.successMessage}
						/>

						<form
							onSubmit={(e) => {
								e.preventDefault();
								this.props.onSubmit();
							}}
							className="space-y-6"
						>
							<DockerContainerCreateBasicFields
								name={this.props.name}
								image={this.props.image}
								cmd={this.props.cmd}
								workingDir={this.props.workingDir}
								user={this.props.user}
								tty={this.props.tty}
								onFieldChange={this.props.onFieldChange}
							/>

							<DockerContainerCreatePorts
								ports={this.props.ports}
								onAdd={this.props.onAddPort}
								onUpdate={this.props.onUpdatePort}
								onRemove={this.props.onRemovePort}
							/>

							<DockerContainerCreateEnvironment
								envVars={this.props.envVars}
								onAdd={this.props.onAddEnvVar}
								onUpdate={this.props.onUpdateEnvVar}
								onRemove={this.props.onRemoveEnvVar}
							/>

							<DockerContainerCreateVolumes
								volumes={this.props.volumes}
								onAdd={this.props.onAddVolume}
								onUpdate={this.props.onUpdateVolume}
								onRemove={this.props.onRemoveVolume}
							/>

							<DockerContainerCreateLabels
								labels={this.props.labels}
								onAdd={this.props.onAddLabel}
								onUpdate={this.props.onUpdateLabel}
								onRemove={this.props.onRemoveLabel}
							/>

							<DockerContainerCreateAdvanced
								memory={this.props.memory}
								cpuShares={this.props.cpuShares}
								restartPolicy={this.props.restartPolicy}
								networkMode={this.props.networkMode}
								onFieldChange={this.props.onFieldChange}
							/>

							<DockerContainerCreateActions
								loading={this.props.loading}
								onReset={this.props.onReset}
							/>
						</form>
					</CardContent>
				</Card>
			);
		}
	},
);
