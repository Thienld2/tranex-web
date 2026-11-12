"use client"

import { Send } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

import type { ContactKind, Content } from "@/lib/i18n/types"

type Labels = Content["contactPage"]["form"]
type Values = {
  type: ContactKind
  name: string
  company: string
  email: string
  phone: string
  address: string
  message: string
  agree: boolean
}
type Errors = Partial<Record<keyof Values, string>>

const KINDS: ContactKind[] = ["consult", "plan", "profile", "partner"]
const isKind = (v: string): v is ContactKind => (KINDS as string[]).includes(v)

/**
 * Contact form. There is no backend on static hosting, so submitting opens
 * the visitor's email app with everything pre-filled (addressed to the
 * company inbox). Cards/buttons link to "#form-<kind>": the form scrolls into
 * view and the kind (not shown to the visitor) is used in the email subject.
 */
export function ContactForm({
  labels,
  kinds,
  email,
}: {
  labels: Labels
  kinds: { key: ContactKind; title: string }[]
  email: string
}) {
  const [v, setV] = useState<Values>({
    type: "consult",
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    message: "",
    agree: false,
  })
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // "#form-plan" etc. → remember the kind and bring the form into view
  useEffect(() => {
    const apply = () => {
      const m = /^#form-(\w+)$/.exec(window.location.hash)
      if (m && isKind(m[1]!)) {
        setV((s) => ({ ...s, type: m[1] as ContactKind }))
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
    apply()
    window.addEventListener("hashchange", apply)
    return () => window.removeEventListener("hashchange", apply)
  }, [])

  const set =
    <K extends keyof Values>(k: K) =>
    (value: Values[K]) => {
      setV((s) => ({ ...s, [k]: value }))
      setErrors((e) => ({ ...e, [k]: undefined }))
    }

  const validate = (): Errors => {
    const e: Errors = {}
    for (const k of ["name", "email", "phone", "message"] as const)
      if (!v[k].trim()) e[k] = labels.errRequired
    if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
      e.email = labels.errEmail
    if (!v.agree) e.agree = labels.errRequired
    return e
  }

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    const first = Object.keys(e)[0]
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    const kindTitle = kinds.find((k) => k.key === v.type)?.title ?? ""
    const body = [
      `${labels.name}: ${v.name}`,
      v.company ? `${labels.company}: ${v.company}` : null,
      `${labels.email}: ${v.email}`,
      `${labels.phone}: ${v.phone}`,
      v.address ? `${labels.address}: ${v.address}` : null,
      "",
      `${labels.message}:`,
      v.message,
    ]
      .filter((x) => x !== null)
      .join("\n")
    const subject = `[TRANEX] ${kindTitle} – ${v.name}`
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  const input =
    "h-12 w-full rounded-[3px] border bg-white px-4 text-base outline-none transition-colors placeholder:text-neutral-400 focus:border-brand"
  const border = (k: keyof Values) => (errors[k] ? "border-red-500" : "border-neutral-300")

  return (
    <form
      ref={formRef}
      id="form"
      onSubmit={onSubmit}
      noValidate
      className="scroll-mt-28 border border-neutral-300 bg-white"
    >
      <Row label={labels.name} error={errors.name}>
        <input name="name" autoComplete="name" value={v.name} onChange={(e) => set("name")(e.target.value)} className={cn(input, border("name"))} />
      </Row>
      <Row label={labels.company}>
        <input name="company" autoComplete="organization" value={v.company} onChange={(e) => set("company")(e.target.value)} className={cn(input, border("company"))} />
      </Row>
      <Row label={labels.email} error={errors.email}>
        <input name="email" type="email" autoComplete="email" value={v.email} onChange={(e) => set("email")(e.target.value)} className={cn(input, border("email"))} />
      </Row>
      <Row label={labels.phone} error={errors.phone}>
        <input name="phone" type="tel" autoComplete="tel" value={v.phone} onChange={(e) => set("phone")(e.target.value)} className={cn(input, border("phone"), "sm:max-w-sm")} />
      </Row>
      <Row label={labels.address}>
        <input name="address" autoComplete="street-address" value={v.address} onChange={(e) => set("address")(e.target.value)} className={cn(input, border("address"))} />
      </Row>
      <Row label={labels.message} error={errors.message}>
        <textarea
          name="message"
          rows={6}
          value={v.message}
          placeholder={labels.messagePlaceholder}
          onChange={(e) => set("message")(e.target.value)}
          className={cn(input, border("message"), "h-auto py-3 leading-relaxed")}
        />
      </Row>

      <div className="flex flex-col items-center gap-4 px-5 py-10 sm:px-10">
        <label className="flex cursor-pointer items-center gap-3 text-[15px] font-bold text-neutral-800">
          <input
            name="agree"
            type="checkbox"
            checked={v.agree}
            onChange={(e) => set("agree")(e.target.checked)}
            className="size-5 accent-[#138a4c]"
          />
          {labels.agree}
        </label>
        {errors.agree && <p className="-mt-2 text-[13px] text-red-600">{errors.agree}</p>}
        <button
          type="submit"
          className="mt-2 flex h-[60px] min-w-[280px] items-center justify-center gap-3 rounded-[5px] bg-brand px-10 text-[17px] font-bold text-white transition-colors hover:bg-brand-dark"
        >
          {labels.submit}
          <Send className="size-4" aria-hidden="true" />
        </button>
        <p className="text-center text-[13px] text-neutral-500" aria-live="polite">
          {sent ? <span className="font-bold text-brand">{labels.sent}</span> : labels.note}
        </p>
      </div>
    </form>
  )
}

function Row({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-3 border-b border-neutral-200 px-5 py-6 sm:px-10 md:grid-cols-[260px_1fr] md:items-start md:gap-8">
      <div className="flex items-center gap-3 md:pt-3">
        <span className="text-[15px] font-bold text-neutral-800">{label}</span>
      </div>
      <div>
        {children}
        {error && <p className="mt-1.5 text-[13px] text-red-600">{error}</p>}
      </div>
    </div>
  )
}
