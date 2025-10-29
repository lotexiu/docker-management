// import { ThemeVariables } from "./types";

import Color, { ColorTypes } from "colorjs.io";
import type { BaseTheme } from "./types";

export function newTheme(name:string, baseTheme: BaseTheme) {
  const theme:BaseTheme<Color> = {} as BaseTheme<Color>;
  Object.entries(baseTheme).forEach(([key, value]): void => {
    if (!(key === "percentageForegroundMix")) {
      if (key == "foreground" && !value) value = "rgb(0 0 0)";
      theme[key as keyof BaseTheme] = new Color(value as ColorTypes) as any;
      return;
    }
    theme.percentageForegroundMix = value as number ?? 0.8;
  });

  function applyForegroundInterpolation(key?: keyof BaseTheme): Color|undefined {
    const color = theme[key!] as Color;
    validateColorWithForeground(key, color, theme.foreground);
    return applyInterpolation(color, theme.foreground, theme.percentageForegroundMix);
  }
  validateColorWithForeground("background", theme.background, theme.foreground);

  const themeVariables = {
    "--foreground": theme.foreground?.toString(),
    "--background": theme.background?.toString(),
    "--card": theme.card?.toString(),
    "--popover": theme.popover?.toString(),
    "--primary": theme.primary?.toString(),
    "--secondary": theme.secondary?.toString(),
    "--muted": theme.muted?.toString(),
    "--accent": theme.accent?.toString(),
    "--destructive": theme.destructive?.toString(),
    "--border": theme.border?.toString(),
    "--input": theme.input?.toString(),
    "--ring": theme.ring?.toString(),
    "--chart-1": theme.chart1?.toString(),
    "--chart-2": theme.chart2?.toString(),
    "--chart-3": theme.chart3?.toString(),
    "--chart-4": theme.chart4?.toString(),
    "--chart-5": theme.chart5?.toString(),
    "--sidebar": theme.Sidebar?.toString(),
    "--sidebar-primary": theme.SidebarPrimary?.toString(),
    "--sidebar-accent": theme.SidebarAccent?.toString(),
    "--sidebar-border": theme.SidebarBorder?.toString(),
    "--sidebar-ring": theme.SidebarRing?.toString(),
    "--card-foreground": applyForegroundInterpolation("card")?.toString(),
    "--popover-foreground": applyForegroundInterpolation("popover")?.toString(),
    "--primary-foreground": applyForegroundInterpolation("primary")?.toString(),
    "--secondary-foreground": applyForegroundInterpolation("secondary")?.toString(),
    "--muted-foreground": applyForegroundInterpolation("muted")?.toString(),
    "--accent-foreground": applyForegroundInterpolation("accent")?.toString(),
    "--sidebar-foreground": applyForegroundInterpolation("Sidebar")?.toString(),
    "--sidebar-primary-foreground": applyForegroundInterpolation("SidebarPrimary")?.toString(),
    "--sidebar-accent-foreground": applyForegroundInterpolation("SidebarAccent")?.toString(),
  }
  applyTheme(themeVariables);
}

function validateColorWithForeground(key?: keyof BaseTheme, color1?: Color, foregroundColor?: Color): void {
  if (!color1 || !foregroundColor) return ;  
  const result: number = [color1.luminance - 1, foregroundColor.luminance].reduce((a,b)=> a+b,0);
  if (result > 0.65 || result < -0.65) {
    throw new Error(`Colors have insufficient contrast; may cause visibility issues. (${key})`);
  }
}

function applyInterpolation(
  color1?: Color,
  color2?: Color,
  factor?: number,
): Color|undefined {
  if (!color1 || !color2 || factor === undefined) return;
  return color1?.range(color2)(factor);
}

function applyTheme(theme: Record<string, string|undefined>): void {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme)) {
    if (value) {
      root.style.setProperty(key, value);
    }
  }
}