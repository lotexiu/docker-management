"use client";

import { usePathname } from "next/navigation";
import React from "react";

function humanizeSegment(seg: string) {
  return seg
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export default function RouteTitle() {
  const pathname = usePathname() || "/";

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return <label className="grow">Home</label>;

  // Use last segment as title by default
  const last = decodeURIComponent(segments[segments.length - 1]);
  const title = humanizeSegment(last);

  return <label className="grow">{title}</label>;
}
