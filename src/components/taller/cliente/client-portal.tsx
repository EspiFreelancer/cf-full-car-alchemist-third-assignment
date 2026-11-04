'use client'

import { Wrench } from 'lucide-react'
import { BrandLogo } from '@/components/taller/brand-logo'
import { Patente } from '@/components/taller/status-badge'
import { useTaller } from '@/components/taller/taller-provider'
import { formatFechaHora } from '@/lib/taller/format'
import { ApprovalSection } from './approval-section'
import { StatusHero, StatusStepper } from './status-hero'

export function ClientPortal({ orderId }: { orderId: string }) {
  const { ordenes } = useTaller()
  const orden = ordenes.find((o) => o.id === orderId)

  if (!orden) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-3 px-6 text-center">
        <Wrench className="size-12 text-muted-foreground" aria-hidden="true" />
        <h1 className="text-2xl font-bold">Orden no encontrada</h1>
        <p className="text-muted-foreground">
          Revisá el enlace que te enviamos por WhatsApp o comunicate con el taller.
        </p>
      </main>
    )
  }

  const pendientes = orden.adicionales.filter((a) => a.estado === 'pendiente')

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-4 pb-10 pt-6">
      <header className="flex items-center justify-between gap-3">
        <BrandLogo className="h-9 w-auto rounded-sm" />
        <span className="text-xs text-muted-foreground">{`Orden ${orden.id}`}</span>
      </header>

      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">{`Hola, ${orden.cliente.nombre.split(' ')[0]}`}</p>
        <div className="flex flex-wrap items-center gap-3">
          <Patente patente={orden.vehiculo.patente} />
          <span className="font-semibold">{orden.vehiculo.modelo}</span>
        </div>
      </div>

      <StatusHero estado={orden.estado} />

      <ApprovalSection key={orden.id} ordenId={orden.id} pendientes={pendientes} />

      <section aria-labelledby="progreso" className="rounded-md border border-border bg-card p-5">
        <h2 id="progreso" className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Progreso
        </h2>
        <StatusStepper estado={orden.estado} />
        <p className="text-xs text-muted-foreground">
          {`Última actualización: ${formatFechaHora(orden.updated_at)}`}
        </p>
      </section>
    </main>
  )
}
