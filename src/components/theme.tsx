"use client";

import { ThemeUtils } from "@lotexiu/typescript/theme/utils";
import { ReactNode, useEffect } from "react";
import { TTheme } from "@lotexiu/typescript/theme/types";
import { Property } from "@lotexiu/typescript/natives/object/proxy/types";
import { ReactUIClient } from "@lotexiu/react/components/ReactUIComponent/ReactUIClient";
import { DefaultThemes } from "@lotexiu/typescript";
import { ReactWrapper } from "@lotexiu/react/components/implementations";

export const Theme = ReactWrapper(
	class Theme extends ReactUIClient() {
		setupHooks(): void {
			const theme: TTheme = DefaultThemes.oceanic.dark;
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
