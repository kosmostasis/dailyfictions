"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DailyFictionsLogo } from "./DailyFictionsLogo";
import { isRoomSlug } from "@/lib/constants";

export function HeaderLogo() {
  const pathname = usePathname();
  const roomSlug =
    pathname?.startsWith("/rooms/") &&
    isRoomSlug(pathname.replace("/rooms/", "").split("/")[0] ?? "")
      ? (pathname.replace("/rooms/", "").split("/")[0] as import("@/lib/constants").RoomSlug)
      : null;

  return (
    <Link
      href="/"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition-opacity hover:opacity-80"
      aria-label="Daily Fictions – Home"
    >
      <DailyFictionsLogo roomSlug={roomSlug} />
    </Link>
  );
}
