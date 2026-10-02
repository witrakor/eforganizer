"use client";
import NextLink from "next/link";
import type { ComponentProps } from "react";
/** Public navigation is coordinated by NavigationState; hash links keep native scrolling. */
export default function SiteLink(props: ComponentProps<typeof NextLink>) {
  const href =
    typeof props.href === "string" ? props.href : props.href.pathname || "";
  return <NextLink {...props} scroll={props.scroll ?? href.includes("#")} />;
}
