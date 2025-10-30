"use client";

import { newTheme } from "@/app/lib/theme/theme";
import { BaseTheme } from "@/app/lib/theme/types";
import { useEffect } from "react";
import { Palette } from "lucide-react";

const color2 = "rgb(255,255,255)"
const color1 = "rgb(0,0,0)"

const theme: BaseTheme = {

  background: "black",
  foreground: "white",
  card: color1,
  popover: color1,
  primary: "rgb(246, 204, 24)",
  secondary: color1,
  accent: color1,
  destructive: color1,
  muted: 'rgb(200,180,150)',
  border: "rgb(246, 204, 24)",
  input: color1,
  ring: color1,
  chart1: color1,
  chart2: color1,
  chart3: color1,
  chart4: color1,
  chart5: color1,
  Sidebar: color1,
  SidebarPrimary: color1,
  SidebarAccent: color1,
  SidebarBorder: color1,
  SidebarRing: color1,
  percentageForegroundMix: 0.7,
};


export function ThemeControl() {
  useEffect(()=>{
    newTheme('default', theme);
  })


	return (
		<div className="flex">
      <Palette size={40}></Palette>
		</div>
	);
}