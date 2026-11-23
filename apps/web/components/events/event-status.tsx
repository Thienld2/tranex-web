"use client"

import { useEffect, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

export type EventStatus = "upcoming" | "ongoing" | "ended"

const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

/**
 * Status from the visitor's current date. The site is static, so this is
 * worked out in the browser (null during server render / first paint).
 */
export function useEventStatus(dates: string[]): EventStatus | null {
  const [status, setStatus] = useState<EventStatus | null>(null)
  useEffect(() => {
    const now = today()
    setStatus(now < dates[0]! ? "upcoming" : now > dates[dates.length - 1]! ? "ended" : "ongoing")
  }, [dates])
  return status
}

/** "Đang nhận đăng ký / Đang diễn ra / Đã kết thúc" badge. */
export function EventStatusBadge({
  dates,
  labels,
  className,
}: {
  dates: string[]
  labels: Record<EventStatus, string>
  className?: string
}) {
  const status = useEventStatus(dates)
  if (!status) return null
  return (
    <span
      className={cn(
        "inline-block rounded-[3px] px-2.5 py-1 text-[12.5px] leading-none font-bold animate-in fade-in-0",
        status === "upcoming" && "bg-brand text-white",
        status === "ongoing" && "bg-[#e8a317] text-white",
        status === "ended" && "bg-neutral-500 text-white",
        className
      )}
    >
      {labels[status]}
    </span>
  )
}
