import { ColorTypes } from "colorjs.io";

export type BaseTheme<T=ColorTypes> = Partial<{
  percentageForegroundMix: number;
  foreground: T;
  background: T;
  card: T;
  popover: T;
  primary: T;
  secondary: T;
  muted: T;
  accent: T;
  destructive: T;
  border: T;
  input: T;
  ring: T;
  chart1: T;
  chart2: T;
  chart3: T;
  chart4: T;
  chart5: T;
  Sidebar: T;
  SidebarPrimary: T;
  SidebarAccent: T;
  SidebarBorder: T;
  SidebarRing: T;
}>;