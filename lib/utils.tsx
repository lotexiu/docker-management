import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { VariationSetterFunction, VariationsTable, SettingSelection } from "./types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function cv<C extends Record<string, any>, S>({ components, settings }: VariationsTable<C, S>): VariationSetterFunction<C, S> {
	return function (preferences: SettingSelection<S>) {
		const componentsWithVariation = {} as C;

		Object.entries(components).forEach(([componentName, Component]) => {
			const Wrapped = function (props: any) {
				const variantSettings: Record<string, any> = {};
				Object.entries(settings).forEach(([settingKey, settingOptions]) => {
					const config = (preferences as any)[settingKey] ?? "default";
					const configOptions = settingOptions?.[config as string];
					const configOption = configOptions?.[componentName];
					variantSettings[settingKey] = configOption;
				})
				return <Component {...props} variantSettings={variantSettings} />;
			};

			componentsWithVariation[componentName as keyof C] = Wrapped as C[keyof C];
		});

		return componentsWithVariation;
	};
};
