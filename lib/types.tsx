export type VariationsTable<C,S> = {
	components: C extends Components ? C : never;
	settings: S extends Settings<C> ? S : Settings<C>;
}

export type VariantProp<S=any> = {
	variantSettings?: {
		[K in keyof S]?: string;
	}
}

export type Components = {
	[key: string]: Function // React.ComponentType<any>; Não é possivel usar por causa de recursão circular
}

export type VariationSetterFunction<C=any,S=any> = (
	settings: SettingSelection<S>
) => C

export type SettingSelection<S> = {
	[K in keyof S]?: keyof S[K];
} & {
	variants?: S extends Settings ? keyof S['variants'] : never;
}

export type Settings<C=any> = {
	variants: {
		default: {
			[K in keyof C]?: string;
		}
		[variant: string]: {
			[K in keyof C]?: string;
		}
	}
	[setting: string]: {
		default: {
			[K in keyof C]?: string;
		}
		[option: string]: {
			[K in keyof C]?: string;
		}
	}
}