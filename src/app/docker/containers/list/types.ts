export interface ContainerData {
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
}

export interface PaginationData {
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
}

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}
