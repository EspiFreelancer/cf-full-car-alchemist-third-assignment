'use client'

import { useTaller } from '@/components/taller/taller-provider'
import { ESTADO_CONFIG, ESTADOS_ORDEN } from '@/lib/taller/estados'
import { cn } from '@/lib/utils'
import { VehicleCard } from './vehicle-card'

export function MechanicPanel() {
  const { ordenes } = useTaller()

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-3 py-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Resumen por estado">
        {ESTADOS_ORDEN.map((estado) => {
          const total = ordenes.filter((o) => o.estado === estado).length
          return (
            <div
              key={estado}
              className={cn(
                'flex flex-col items-center rounded-md border border-border/60 px-2 py-3 shadow-md shadow-black/20',
                ESTADO_CONFIG[estado].solid,
              )}
            >
              <span className="text-3xl font-extrabold leading-none">{total}</span>
              <span className="mt-1 text-center text-[11px] font-bold uppercase leading-tight tracking-wide">
                {ESTADO_CONFIG[estado].label}
              </span>
            </div>
          )
        })}
      </div>

      <h1 className="sr-only">Vehículos en el taller</h1>
      {ordenes.length === 0 ? (
        <p className="rounded-lg border-2 border-dashed p-8 text-center text-muted-foreground">
          No hay vehículos en el taller.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {ordenes.map((orden) => (
            <li key={orden.id}>
              <VehicleCard orden={orden} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
