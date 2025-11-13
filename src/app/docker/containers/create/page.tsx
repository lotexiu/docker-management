"use client";

import { ReactWrapper } from "../../../../../../../packages/react/dist/components/implementations";
import { ReactNode } from "react";
import "@lotexiu/typescript/global";
import { DockerContainerCreateHeader } from "./client/Header";
import { DockerContainerCreateContent } from "./client/content/Content";
import {
	ApiResponse,
	CreateContainerFormData,
	PortMapping,
	EnvironmentVariable,
	VolumeMount,
	LabelEntry,
	BasicFieldsData,
	AdvancedFieldsData,
} from "./types";
import { useRouter } from "next/navigation";

const DockerContainerCreatePage = ReactWrapper(
	class DockerContainerCreatePage extends ReactWrapper.Client {
		// Apenas estado de UI global
		loading: boolean = false;
		error: string | null = null;
		successMessage: string | null = null;

		router: ReturnType<typeof useRouter> | null = null;

		setupHooks(): void {
			this.router = useRouter();
		}

		// Lógica de construção do payload
		buildFormData(data: {
			basic: BasicFieldsData;
			advanced: AdvancedFieldsData;
			ports: PortMapping[];
			envVars: EnvironmentVariable[];
			volumes: VolumeMount[];
			labels: LabelEntry[];
		}): CreateContainerFormData {
			const formData: CreateContainerFormData = {
				image: data.basic.image.trim(),
			};

			// Basic fields
			if (data.basic.name.trim()) formData.name = data.basic.name.trim();
			if (data.basic.cmd.trim())
				formData.cmd = data.basic.cmd.split(" ").filter(Boolean);
			if (data.basic.workingDir.trim())
				formData.workingDir = data.basic.workingDir.trim();
			if (data.basic.user.trim()) formData.user = data.basic.user.trim();
			formData.tty = data.basic.tty;

			// Environment variables
			if (data.envVars.length > 0) {
				formData.env = data.envVars
					.filter((env) => env.key.trim() && env.value.trim())
					.map((env) => `${env.key}=${env.value}`);
			}

			// Ports
			if (data.ports.length > 0) {
				const exposedPorts: Record<string, Record<string, never>> = {};
				const portBindings: Record<string, Array<{ hostPort?: string }>> = {};

				data.ports.forEach((port) => {
					if (port.containerPort.trim()) {
						const portKey = `${port.containerPort}/${port.protocol}`;
						exposedPorts[portKey] = {};

						if (port.hostPort.trim()) {
							portBindings[portKey] = [{ hostPort: port.hostPort }];
						}
					}
				});

				if (Object.keys(exposedPorts).length > 0) {
					formData.exposedPorts = exposedPorts;
					if (!formData.hostConfig) formData.hostConfig = {};
					formData.hostConfig.portBindings = portBindings;
				}
			}

			// Volumes
			if (data.volumes.length > 0) {
				const binds = data.volumes
					.filter((v) => v.hostPath.trim() && v.containerPath.trim())
					.map((v) => `${v.hostPath}:${v.containerPath}:${v.mode || "rw"}`);

				if (binds.length > 0) {
					if (!formData.hostConfig) formData.hostConfig = {};
					formData.hostConfig.binds = binds;
				}
			}

			// Labels
			if (data.labels.length > 0) {
				const labelsObj: Record<string, string> = {};
				data.labels.forEach((label) => {
					if (label.key.trim() && label.value.trim()) {
						labelsObj[label.key] = label.value;
					}
				});
				if (Object.keys(labelsObj).length > 0) {
					formData.labels = labelsObj;
				}
			}

			// Advanced options
			if (
				data.advanced.memory.trim() ||
				data.advanced.cpuShares.trim() ||
				data.advanced.restartPolicy ||
				data.advanced.networkMode.trim()
			) {
				if (!formData.hostConfig) formData.hostConfig = {};

				if (data.advanced.memory.trim()) {
					formData.hostConfig.memory = parseInt(data.advanced.memory, 10);
				}
				if (data.advanced.cpuShares.trim()) {
					formData.hostConfig.cpuShares = parseInt(
						data.advanced.cpuShares,
						10,
					);
				}
				if (data.advanced.restartPolicy) {
					formData.hostConfig.restartPolicy = {
						name: data.advanced.restartPolicy,
					};
				}
				if (data.advanced.networkMode.trim()) {
					formData.hostConfig.networkMode = data.advanced.networkMode;
				}
			}

			return formData;
		}

		// Handler de submit
		async handleSubmit(data: {
			basic: BasicFieldsData;
			advanced: AdvancedFieldsData;
			ports: PortMapping[];
			envVars: EnvironmentVariable[];
			volumes: VolumeMount[];
			labels: LabelEntry[];
		}) {
			// Reset messages
			this.error = null;
			this.successMessage = null;

			// Validate
			if (!data.basic.image.trim()) {
				this.error = "Imagem é obrigatória";
				this.updateView();
				return;
			}

			this.loading = true;
			this.updateView();

			try {
				const formData = this.buildFormData(data);

				// Make API call
				const response = await fetch("/api/docker/containers", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				});

				if (response) {
					const result: ApiResponse = await response.json();
					if (result.success) {
						this.successMessage = "Container criado com sucesso!";
						this.updateView();

						// Redirect after 2 seconds
						setTimeout(() => {
							this.router?.push("/docker/containers/list");
						}, 2000);
					} else {
						this.error = result.error || "Erro ao criar container";
						this.updateView();
					}
				}
			} catch (err) {
				this.error = "Erro ao conectar com a API";
				console.error("Erro ao criar container:", err);
				this.updateView();
			} finally {
				this.loading = false;
				this.updateView();
			}
		}

		handleReset() {
			this.error = null;
			this.successMessage = null;
			this.updateView();
		}

		render(): ReactNode {
			return (
				<div className="container mx-auto py-8 px-4 max-w-4xl">
					<DockerContainerCreateHeader />
					<DockerContainerCreateContent
						error={this.error}
						successMessage={this.successMessage}
						loading={this.loading}
						onSubmit={this.handleSubmit}
						onReset={this.handleReset}
					/>
				</div>
			);
		}
	},
);

export default DockerContainerCreatePage;
