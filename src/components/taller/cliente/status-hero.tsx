import { CheckCircle2, ClipboardCheck, Hourglass, Search, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ESTADO_CONFIG, ESTADOS_ORDEN } from '@/lib/taller/estados'
import type { EstadoOrden } from '@/lib/taller/types'
import { cn } from '@/lib/utils'

const ICONOS: Record<EstadoOrden, LucideIcon> = {
  en_revision: Search,
  esperando_aprobacion: Hourglass,
  en_reparacion: Wrench,
  listo: CheckCircle2,
}

export function StatusHero({ estado }: { estado: EstadoOrden }) {
  const config = ESTADO_CONFIG[estado]
  const Icono = ICONOS[estado]
  return (
    <section
      aria-live="polite"
      className={cn(
        'flex flex-col items-center gap-3 rounded-md border border-border/60 px-6 py-8 text-center shadow-lg shadow-black/30',
        config.solid,
      )}
    >
      <Icono className="size-16" strokeWidth={2.25} aria-hidden="true" />
      <p className="text-sm font-semibold uppercase tracking-widest opacity-80">Estado actual</p>
      <h1 className="text-balance text-4xl font-extrabold leading-tight">{config.label}</h1>
      <p className="text-pretty text-base font-medium opacity-90">{config.descripcionCliente}</p>
    </section>
  )
}

export function StatusStepper({ estado }: { estado: EstadoOrden }) {
  const indiceActual = ESTADOS_ORDEN.indexOf(estado)
  return (
    <ol className="flex flex-col" aria-label="Progreso de la reparación">
      {ESTADOS_ORDEN.map((paso, i) => {
        const config = ESTADO_CONFIG[paso]
        const completo = i < indiceActual
        const actual = i === indiceActual
        return (
          <li key={paso} className="flex gap-4" aria-current={actual ? 'step' : undefined}>
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-full border-4 text-sm font-bold',
                  actual && cn(config.solid, 'border-transparent ring-4 ring-offset-2', config.ring),
                  completo && 'border-foreground bg-foreground text-background',
                  !actual && !completo && 'border-border bg-card text-muted-foreground',
                )}
              >
                {completo ? <ClipboardCheck className="size-5" aria-hidden="true" /> : i + 1}
              </span>
              {i < ESTADOS_ORDEN.length - 1 && (
                <span
                  className={cn('my-1 w-1 flex-1 rounded-full', completo ? 'bg-foreground' : 'bg-border')}
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="pb-6 pt-2">
              <p
                className={cn(
                  'text-lg font-bold leading-none',
                  !actual && !completo && 'text-muted-foreground',
                )}
              >
                {config.label}
              </p>
              {actual && <p className="mt-1 text-sm text-muted-foreground">Paso actual</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
