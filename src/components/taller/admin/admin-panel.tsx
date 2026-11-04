'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ExternalLink, MessageCircle } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Patente, StatusBadge } from '@/components/taller/status-badge'
import { useTaller } from '@/components/taller/taller-provider'
import { formatFechaHora, whatsappLink } from '@/lib/taller/format'
import { cn } from '@/lib/utils'
import { AuditLog } from './audit-log'
import { IntakeForm } from './intake-form'

export function AdminPanel() {
  const { ordenes, logs } = useTaller()
  const [seleccionId, setSeleccionId] = useState<string | null>(ordenes[0]?.id ?? null)
  const seleccion = ordenes.find((o) => o.id === seleccionId) ?? ordenes[0]

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[360px_1fr]">
      <h1 className="sr-only">Panel de administración</h1>
      <div className="flex flex-col gap-6">
        <IntakeForm onCreado={setSeleccionId} />
      </div>

      <div className="grid gap-6 md:grid-cols-[minmax(0,280px)_1fr]">
        <section aria-labelledby="ordenes-titulo" className="flex flex-col gap-3">
          <h2 id="ordenes-titulo" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {`Vehículos (${ordenes.length})`}
          </h2>
          <ul className="flex flex-col gap-2">
            {[...ordenes].reverse().map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  onClick={() => setSeleccionId(o.id)}
                  aria-pressed={seleccion?.id === o.id}
                  className={cn(
                    'flex w-full flex-col gap-2 rounded-lg border-2 bg-card p-3 text-left transition-colors',
                    seleccion?.id === o.id
                      ? 'border-status-approval bg-secondary'
                      : 'border-transparent hover:border-border',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Patente patente={o.vehiculo.patente} className="text-sm" />
                    <StatusBadge estado={o.estado} className="text-[11px]" />
                  </div>
                  <span className="truncate text-sm font-medium">{o.vehiculo.modelo}</span>
                  <span className="truncate text-xs text-muted-foreground">{o.cliente.nombre}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {seleccion && (
          <Card className="h-fit">
            <CardHeader className="gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <Patente patente={seleccion.vehiculo.patente} />
                <StatusBadge estado={seleccion.estado} />
              </div>
              <CardTitle className="text-xl">{seleccion.vehiculo.modelo}</CardTitle>
              <CardDescription>
                {`${seleccion.cliente.nombre} · ${seleccion.cliente.telefono} · Ingresó ${formatFechaHora(seleccion.created_at)}`}
              </CardDescription>
              <p className="text-sm">
                <span className="font-semibold">Falla inicial: </span>
                {seleccion.falla_inicial}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/cliente/${seleccion.id}`}
                  className={cn(buttonVariants({ variant: 'outline' }), 'h-10 gap-2')}
                >
                  <ExternalLink className="size-4" aria-hidden="true" />
                  Portal del cliente
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const url = whatsappLink(
                      seleccion.cliente.telefono,
                      `Hola ${seleccion.cliente.nombre.split(' ')[0]}, seguí el estado de tu ${seleccion.vehiculo.modelo} acá: ${window.location.origin}/cliente/${seleccion.id}`,
                    )
                    window.open(url, '_blank', 'noopener,noreferrer')
                  }}
                  className={cn(
                    buttonVariants(),
                    'h-10 gap-2 bg-status-ready text-status-ready-foreground hover:bg-status-ready/90',
                  )}
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Enviar por WhatsApp
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Historial de auditoría
              </h3>
              <AuditLog logs={logs.filter((l) => l.orden_id === seleccion.id)} />
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
