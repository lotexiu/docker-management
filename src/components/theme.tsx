"use client";
import { ThemeUtils } from "@lotexiu/typescript/theme/utils";
import { ReactNode, useEffect } from "react";
import { TTheme } from "@lotexiu/typescript/theme/types";
import { Property } from "@lotexiu/typescript/natives/object/proxy/types";
import { ReactWrapper } from "../../../../packages/react/dist/components/implementations";
import { DefaultReactThemes } from "@lotexiu/react/theme/implementations";
import { ReactUIClient } from "@lotexiu/react/components/ReactUIComponent/ReactUIClient";

export const Theme = ReactWrapper(
	class extends ReactUIClient() {
		setupHooks(): void {
			const theme: TTheme = DefaultReactThemes.oceanic.dark;
			useEffect(() => {
				ThemeUtils.applyThemeToDocument(theme);
			});
		}

		onChanges(property: Property<this, keyof this>): void {
			// console.log(property)
		}

		render(): ReactNode {
			return null;
		}
	},
);
