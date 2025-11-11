'use client';

import { ReactWrapper } from '@lotexiu/react/components/implementations';
import { ReactNode } from 'react';
import '@lotexiu/typescript/global';
import { DockerContainerCreateHeader } from './client/Header';
import { DockerContainerCreateContent } from './client/content/Content';
import {
	ApiResponse,
	CreateContainerFormData,
	PortMapping,
	EnvironmentVariable,
	VolumeMount,
	LabelEntry,
} from './types';
import { useRouter } from 'next/navigation';

const DockerContainerCreatePage = ReactWrapper(
	class DockerContainerCreatePage extends ReactWrapper.ClientComponent {
		// Form state
		name: string = '';
		image: string = '';
		cmd: string = '';
		workingDir: string = '';
		user: string = '';
		tty: boolean = false;

		// Advanced options
		memory: string = '';
		cpuShares: string = '';
		restartPolicy: '' | 'always' | 'unless-stopped' | 'on-failure' = '';
		networkMode: string = '';

		// Arrays for dynamic fields
		ports: PortMapping[] = [];
		envVars: EnvironmentVariable[] = [];
		volumes: VolumeMount[] = [];
		labels: LabelEntry[] = [];

		// UI state
		loading: boolean = false;
		error: string | null = null;
		successMessage: string | null = null;

		router: ReturnType<typeof useRouter> | null = null;

		setupHooks(): void {
			this.router = useRouter();
		}

		// Port methods
		addPort() {
			this.ports.push({ containerPort: '', hostPort: '', protocol: 'tcp' });
			this.updateView();
		}

		updatePort(index: number, field: keyof PortMapping, value: string) {
			if (this.ports[index]) {
				this.ports[index][field] = value as any;
				this.updateView();
			}
		}

		removePort(index: number) {
			this.ports.splice(index, 1);
			this.updateView();
		}

		// Environment variable methods
		addEnvVar() {
			this.envVars.push({ key: '', value: '' });
			this.updateView();
		}

		updateEnvVar(index: number, field: keyof EnvironmentVariable, value: string) {
			if (this.envVars[index]) {
				this.envVars[index][field] = value;
				this.updateView();
			}
		}

		removeEnvVar(index: number) {
			this.envVars.splice(index, 1);
			this.updateView();
		}

		// Volume methods
		addVolume() {
			this.volumes.push({ hostPath: '', containerPath: '', mode: 'rw' });
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

		// Label methods
		addLabel() {
			this.labels.push({ key: '', value: '' });
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

		// Form submission
		async handleSubmit() {
			// Reset messages
			this.error = null;
			this.successMessage = null;

			// Validate
			if (!this.image.trim()) {
				this.error = 'Imagem é obrigatória';
				this.updateView();
				return;
			}

			this.loading = true;
			this.updateView();

			try {
				// Build form data
				const formData: CreateContainerFormData = {
					image: this.image.trim(),
				};

				if (this.name.trim()) formData.name = this.name.trim();
				if (this.cmd.trim()) formData.cmd = this.cmd.split(' ').filter(Boolean);
				if (this.workingDir.trim()) formData.workingDir = this.workingDir.trim();
				if (this.user.trim()) formData.user = this.user.trim();
				formData.tty = this.tty;

				// Environment variables
				if (this.envVars.length > 0) {
					formData.env = this.envVars
						.filter((env) => env.key.trim() && env.value.trim())
						.map((env) => `${env.key}=${env.value}`);
				}

				// Ports
				if (this.ports.length > 0) {
					const exposedPorts: Record<string, Record<string, never>> = {};
					const portBindings: Record<string, Array<{ hostPort?: string }>> = {};

					this.ports.forEach((port) => {
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
				if (this.volumes.length > 0) {
					const binds = this.volumes
						.filter((v) => v.hostPath.trim() && v.containerPath.trim())
						.map((v) => `${v.hostPath}:${v.containerPath}:${v.mode || 'rw'}`);

					if (binds.length > 0) {
						if (!formData.hostConfig) formData.hostConfig = {};
						formData.hostConfig.binds = binds;
					}
				}

				// Labels
				if (this.labels.length > 0) {
					const labelsObj: Record<string, string> = {};
					this.labels.forEach((label) => {
						if (label.key.trim() && label.value.trim()) {
							labelsObj[label.key] = label.value;
						}
					});
					if (Object.keys(labelsObj).length > 0) {
						formData.labels = labelsObj;
					}
				}

				// Host config
				if (this.memory.trim() || this.cpuShares.trim() || this.restartPolicy || this.networkMode.trim()) {
					if (!formData.hostConfig) formData.hostConfig = {};

					if (this.memory.trim()) {
						formData.hostConfig.memory = parseInt(this.memory, 10);
					}
					if (this.cpuShares.trim()) {
						formData.hostConfig.cpuShares = parseInt(this.cpuShares, 10);
					}
					if (this.restartPolicy) {
						formData.hostConfig.restartPolicy = { name: this.restartPolicy };
					}
					if (this.networkMode.trim()) {
						formData.hostConfig.networkMode = this.networkMode;
					}
				}

				// Make API call
				const response = await fetch('/api/docker/containers', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData),
				});

				if (response){
					const result: ApiResponse = await response.json();
					if (result.success) {
						this.successMessage = 'Container criado com sucesso!';
						this.updateView();

						// Redirect after 2 seconds
						setTimeout(() => {
							this.router?.push('/docker/containers/list');
						}, 2000);
					} else {
						this.error = result.error || 'Erro ao criar container';
						this.updateView();
					}
				}
			} catch (err) {
				this.error = 'Erro ao conectar com a API';
				console.error('Erro ao criar container:', err);
				this.updateView();
			} finally {
				this.loading = false;
				this.updateView();
			}
		}

		resetForm() {
			this.name = '';
			this.image = '';
			this.cmd = '';
			this.workingDir = '';
			this.user = '';
			this.tty = false;
			this.memory = '';
			this.cpuShares = '';
			this.restartPolicy = '';
			this.networkMode = '';
			this.ports = [];
			this.envVars = [];
			this.volumes = [];
			this.labels = [];
			this.error = null;
			this.successMessage = null;
			this.updateView();
		}

		render(): ReactNode {
			return (
				<div className="container mx-auto py-8 px-4 max-w-4xl">
					<DockerContainerCreateHeader />
					<DockerContainerCreateContent
						// Basic fields
						name={this.name}
						image={this.image}
						cmd={this.cmd}
						workingDir={this.workingDir}
						user={this.user}
						tty={this.tty}
						// Advanced fields
						memory={this.memory}
						cpuShares={this.cpuShares}
						restartPolicy={this.restartPolicy}
						networkMode={this.networkMode}
						// Arrays
						ports={this.ports}
						envVars={this.envVars}
						volumes={this.volumes}
						labels={this.labels}
						// Handlers
						onFieldChange={(field, value) => {
							(this as any)[field] = value;
							this.updateView();
						}}
						onAddPort={() => this.addPort()}
						onUpdatePort={(idx, field, val) => this.updatePort(idx, field, val)}
						onRemovePort={(idx) => this.removePort(idx)}
						onAddEnvVar={() => this.addEnvVar()}
						onUpdateEnvVar={(idx, field, val) => this.updateEnvVar(idx, field, val)}
						onRemoveEnvVar={(idx) => this.removeEnvVar(idx)}
						onAddVolume={() => this.addVolume()}
						onUpdateVolume={(idx, field, val) => this.updateVolume(idx, field, val)}
						onRemoveVolume={(idx) => this.removeVolume(idx)}
						onAddLabel={() => this.addLabel()}
						onUpdateLabel={(idx, field, val) => this.updateLabel(idx, field, val)}
						onRemoveLabel={(idx) => this.removeLabel(idx)}
						onSubmit={() => this.handleSubmit()}
						onReset={() => this.resetForm()}
						// UI state
						loading={this.loading}
						error={this.error}
						successMessage={this.successMessage}
					/>
				</div>
			);
		}
	}
);

export default DockerContainerCreatePage;
