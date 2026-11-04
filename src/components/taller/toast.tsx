'use client'

import { useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import { useTaller } from '@/components/taller/taller-provider'

export function Toast() {
  const { notificacion, descartarNotificacion } = useTaller()

  useEffect(() => {
    if (!notificacion) return
    const id = window.setTimeout(descartarNotificacion, 3000)
    return () => window.clearTimeout(id)
  }, [notificacion, descartarNotificacion])

  if (!notificacion) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-3 bottom-4 z-[60] mx-auto flex max-w-md items-center gap-3 rounded-md border-2 border-status-ready bg-card px-4 py-3 text-card-foreground shadow-2xl"
    >
      <CheckCircle2 className="size-6 shrink-0 text-status-ready" aria-hidden="true" />
      <p className="flex-1 text-sm font-bold">{notificacion}</p>
      <button
        type="button"
        onClick={descartarNotificacion}
        aria-label="Cerrar notificación"
        className="flex size-10 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="size-5" aria-hidden="true" />
      </button>
    </div>
  )
}
