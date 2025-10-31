"use client";

import { newTheme } from "@/app/lib/theme/theme";
import { BaseTheme } from "@/app/lib/theme/types";
import { useEffect } from "react";
import { Palette } from "lucide-react";

const color2 = "rgb(255,255,255)"
const color1 = "rgb(0,0,0)"

const theme: BaseTheme = {

  background: "#0d0221",
  foreground: "white",
  card: "gray", // não foi escolhido uma cor
  popover: "gray", // não foi escolhido uma cor
  primary: "#540d6e",
  secondary: "#ff6c11",
  accent: "#791e94",
  destructive: "#fd1d53",
  muted: 'rgb(200,180,150)',
  border: "rgb(20, 255, 125)",
  input: "gray", // não foi escolhido uma cor
  ring: "gray", // não foi escolhido uma cor
  chart1: "gray", // não foi escolhido uma cor
  chart2: "gray", // não foi escolhido uma cor
  chart3: "gray", // não foi escolhido uma cor
  chart4: "gray", // não foi escolhido uma cor
  chart5: "gray", // não foi escolhido uma cor
  Sidebar: "gray", // não foi escolhido uma cor
  SidebarPrimary: "gray", // não foi escolhido uma cor
  SidebarAccent: "gray", // não foi escolhido uma cor
  SidebarBorder: "gray", // não foi escolhido uma cor
  SidebarRing: "gray", // não foi escolhido uma cor
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