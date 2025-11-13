import { Card, CardContent } from "@/components/ui/card";
import { ReactWrapper } from "../../../../../../../../../packages/react/dist/components/implementations";
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
	BasicFieldsData,
	AdvancedFieldsData,
	FormDataProvider,
} from "../../types";

interface DockerContainerCreateContentProps {
	error: string | null;
	successMessage: string | null;
	loading: boolean;
	onSubmit: (data: {
		basic: BasicFieldsData;
		advanced: AdvancedFieldsData;
		ports: PortMapping[];
		envVars: EnvironmentVariable[];
		volumes: VolumeMount[];
		labels: LabelEntry[];
	}) => void;
	onReset: () => void;
}

export const DockerContainerCreateContent = ReactWrapper(
	class DockerContainerCreateContent extends ReactWrapper.Client<DockerContainerCreateContentProps> {
		// Instâncias dos componentes filhos
		basicFieldsInstance: FormDataProvider<BasicFieldsData> | null = null;
		advancedInstance: FormDataProvider<AdvancedFieldsData> | null = null;
		portsInstance: FormDataProvider<PortMapping[]> | null = null;
		envVarsInstance: FormDataProvider<EnvironmentVariable[]> | null = null;
		volumesInstance: FormDataProvider<VolumeMount[]> | null = null;
		labelsInstance: FormDataProvider<LabelEntry[]> | null = null;

		handleSubmit(e: React.FormEvent) {
			e.preventDefault();

			// Coleta dados de todos os componentes filhos
			const data = {
				basic: this.basicFieldsInstance?.getData() || {
					name: "",
					image: "",
					cmd: "",
					workingDir: "",
					user: "",
					tty: false,
				},
				advanced: this.advancedInstance?.getData() || {
					memory: "",
					cpuShares: "",
					restartPolicy: "" as const,
					networkMode: "",
				},
				ports: this.portsInstance?.getData() || [],
				envVars: this.envVarsInstance?.getData() || [],
				volumes: this.volumesInstance?.getData() || [],
				labels: this.labelsInstance?.getData() || [],
			};

			this.props.onSubmit(data);
		}

		handleReset() {
			// Reseta todos os componentes filhos
			this.basicFieldsInstance?.reset();
			this.advancedInstance?.reset();
			this.portsInstance?.reset();
			this.envVarsInstance?.reset();
			this.volumesInstance?.reset();
			this.labelsInstance?.reset();

			// Notifica o pai
			this.props.onReset();
		}

		render(): ReactNode {
			return (
				<Card className="mt-6">
					<CardContent>
						<DockerContainerCreateMessages
							error={this.props.error}
							successMessage={this.props.successMessage}
						/>

						<form onSubmit={this.handleSubmit} className="space-y-6">
							<DockerContainerCreateBasicFields
								onInstanceReady={(instance) => {
									this.basicFieldsInstance = instance;
								}}
							/>

							<DockerContainerCreatePorts
								onInstanceReady={(instance) => {
									this.portsInstance = instance;
								}}
							/>

							<DockerContainerCreateEnvironment
								onInstanceReady={(instance) => {
									this.envVarsInstance = instance;
								}}
							/>

							<DockerContainerCreateVolumes
								onInstanceReady={(instance) => {
									this.volumesInstance = instance;
								}}
							/>

							<DockerContainerCreateLabels
								onInstanceReady={(instance) => {
									this.labelsInstance = instance;
								}}
							/>

							<DockerContainerCreateAdvanced
								onInstanceReady={(instance) => {
									this.advancedInstance = instance;
								}}
							/>

							<DockerContainerCreateActions
								loading={this.props.loading}
								onReset={this.handleReset}
							/>
						</form>
					</CardContent>
				</Card>
			);
		}
	},
);
