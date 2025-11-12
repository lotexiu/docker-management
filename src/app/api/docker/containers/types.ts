import { z } from "zod";
import {
	createContainerSchema,
	updateContainerSchema,
	listContainersSchema,
	containerIdSchema,
} from "./validation";

// Tipos inferidos dos schemas Zod
export type CreateContainerInput = z.infer<typeof createContainerSchema>;
export type UpdateContainerInput = z.infer<typeof updateContainerSchema>;
export type ListContainersInput = z.infer<typeof listContainersSchema>;
export type ContainerIdInput = z.infer<typeof containerIdSchema>;

// Tipos de ações para o PUT
export type ContainerAction =
	| "start"
	| "pause"
	| "unpause"
	| "restart"
	| "stop"
	| "rename"
	| "update";

// Tipos de resposta da API
export interface ContainerResponse {
	id: string;
	name: string;
	image: string;
	status: string;
	state: string;
	created: number;
	ports?: Array<{
		IP?: string;
		PrivatePort: number;
		PublicPort?: number;
		Type: string;
	}>;
	labels?: Record<string, string>;
}

export interface ListContainersResponse {
	containers: ContainerResponse[];
	pagination: {
		page: number;
		pageSize: number;
		total: number;
		totalPages: number;
	};
}

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}
