export interface CreateContainerFormData {
	name?: string;
	image: string;
	cmd?: string[];
	env?: string[];
	exposedPorts?: Record<string, Record<string, never>>;
	hostConfig?: {
		portBindings?: Record<
			string,
			Array<{ hostIp?: string; hostPort?: string }>
		>;
		binds?: string[];
		memory?: number;
		memorySwap?: number;
		cpuShares?: number;
		restartPolicy?: {
			name?: "" | "always" | "unless-stopped" | "on-failure";
			maximumRetryCount?: number;
		};
		networkMode?: string;
	};
	labels?: Record<string, string>;
	workingDir?: string;
	user?: string;
	tty?: boolean;
}

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface PortMapping {
	containerPort: string;
	hostPort: string;
	protocol: "tcp" | "udp";
}

export interface EnvironmentVariable {
	key: string;
	value: string;
}

export interface VolumeMount {
	hostPath: string;
	containerPath: string;
	mode?: "rw" | "ro";
}

export interface LabelEntry {
	key: string;
	value: string;
}
