import { z } from "zod";

// Schema para criação de container
export const createContainerSchema = z.object({
	name: z.string().min(1, "Nome é obrigatório").optional(),
	image: z.string().min(1, "Imagem é obrigatória"),
	cmd: z.array(z.string()).optional(),
	env: z.array(z.string()).optional(),
	exposedPorts: z.record(z.string(), z.object({})).optional(),
	hostConfig: z
		.object({
			portBindings: z
				.record(
					z.string(),
					z.array(
						z.object({
							hostIp: z.string().optional(),
							hostPort: z.string().optional(),
						}),
					),
				)
				.optional(),
			binds: z.array(z.string()).optional(),
			memory: z.number().optional(),
			memorySwap: z.number().optional(),
			cpuShares: z.number().optional(),
			restartPolicy: z
				.object({
					name: z
						.enum(["", "always", "unless-stopped", "on-failure"])
						.optional(),
					maximumRetryCount: z.number().optional(),
				})
				.optional(),
			networkMode: z.string().optional(),
		})
		.optional(),
	networkingConfig: z
		.object({
			endpointsConfig: z
				.record(
					z.string(),
					z.object({
						ipamConfig: z
							.object({
								ipv4Address: z.string().optional(),
								ipv6Address: z.string().optional(),
							})
							.optional(),
						aliases: z.array(z.string()).optional(),
					}),
				)
				.optional(),
		})
		.optional(),
	labels: z.record(z.string(), z.string()).optional(),
	workingDir: z.string().optional(),
	user: z.string().optional(),
	attachStdin: z.boolean().optional(),
	attachStdout: z.boolean().optional(),
	attachStderr: z.boolean().optional(),
	tty: z.boolean().optional(),
	openStdin: z.boolean().optional(),
	stdinOnce: z.boolean().optional(),
});

// Schema para atualização de container
export const updateContainerSchema = z
	.object({
		action: z.enum([
			"start",
			"pause",
			"unpause",
			"restart",
			"stop",
			"rename",
			"update",
		]),
		// Para ação rename
		name: z.string().min(1).optional(),
		// Para ação stop
		timeout: z.number().optional(),
		// Para ação update (configurações do container)
		config: z
			.object({
				cpuShares: z.number().optional(),
				memory: z.number().optional(),
				memorySwap: z.number().optional(),
				memoryReservation: z.number().optional(),
				kernelMemory: z.number().optional(),
				cpuPeriod: z.number().optional(),
				cpuQuota: z.number().optional(),
				cpusetCpus: z.string().optional(),
				cpusetMems: z.string().optional(),
				blkioWeight: z.number().optional(),
				restartPolicy: z
					.object({
						name: z
							.enum(["", "always", "unless-stopped", "on-failure"])
							.optional(),
						maximumRetryCount: z.number().optional(),
					})
					.optional(),
			})
			.optional(),
	})
	.refine(
		(data) => {
			// Se action é rename, name é obrigatório
			if (data.action === "rename" && !data.name) {
				return false;
			}
			// Se action é update, config é obrigatório
			if (data.action === "update" && !data.config) {
				return false;
			}
			return true;
		},
		{
			message: "Campos obrigatórios faltando para a ação especificada",
		},
	);

// Schema para listagem de containers
export const listContainersSchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	pageSize: z.coerce.number().int().min(1).max(100).default(10),
	all: z.coerce.boolean().optional().default(true),
	filters: z.coerce.string().optional().default("{}"), // JSON string de filtros Docker
});

// Schema para ID do container
export const containerIdSchema = z.object({
	id: z.string().min(1, "ID do container é obrigatório"),
});
