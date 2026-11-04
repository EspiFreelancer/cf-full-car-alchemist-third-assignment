'use client'

import { Check } from 'lucide-react'
import { ESTADO_CONFIG, ESTADOS_ORDEN } from '@/lib/taller/estados'
import type { EstadoOrden } from '@/lib/taller/types'
import { cn } from '@/lib/utils'

interface StatusButtonsProps {
  estadoActual: EstadoOrden
  onCambiar: (estado: EstadoOrden) => void
}

export function StatusButtons({ estadoActual, onCambiar }: StatusButtonsProps) {
  return (
    <div role="group" aria-label="Cambiar estado" className="flex flex-col gap-3">
      {ESTADOS_ORDEN.map((estado) => {
        const config = ESTADO_CONFIG[estado]
        const activo = estado === estadoActual
        return (
          <button
            key={estado}
            type="button"
            aria-pressed={activo}
            onClick={() => {
              if (!activo) onCambiar(estado)
            }}
            className={cn(
              'flex min-h-16 items-center justify-center gap-2 rounded-md border-2 px-3 text-center text-lg font-bold leading-tight transition-all active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60',
              activo
                ? cn(config.solid, 'border-transparent shadow-md')
                : cn('bg-card text-foreground hover:bg-secondary', config.border),
            )}
          >
            {activo ? (
              <Check className="size-5 shrink-0" aria-hidden="true" />
            ) : (
              <span className={cn('size-3 shrink-0 rounded-full', config.dot)} aria-hidden="true" />
            )}
            {config.label}
          </button>
        )
      })}
    </div>
  )
}
