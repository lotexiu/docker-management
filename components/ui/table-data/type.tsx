export type VariationsTableComponents = Record<string, React.ComponentType<any>>;

export type VariationsTable<T extends VariationsTableComponents> = {
	components: T;
	variants: { 
		[key: string]: {
			[K in keyof T]?: string 
		}
	};
};