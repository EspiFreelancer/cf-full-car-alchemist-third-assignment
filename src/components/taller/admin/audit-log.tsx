import { ArrowRight, CheckCircle2, CirclePlus, LogIn, RefreshCw, ShieldCheck, XCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { StatusBadge } from '@/components/taller/status-badge'
import { formatFecha, formatHora } from '@/lib/taller/format'
import type { ActorLog, LogAuditoria, TipoLog } from '@/lib/taller/types'
import { cn } from '@/lib/utils'

const ICONOS: Record<TipoLog, LucideIcon> = {
  ingreso: LogIn,
  cambio_estado: RefreshCw,
  adicional_creado: CirclePlus,
  aprobacion: CheckCircle2,
  rechazo: XCircle,
}

const ACTOR: Record<ActorLog, string> = {
  admin: 'Administración',
  mecanico: 'Mecánico',
  cliente: 'Cliente',
}

export function AuditLog({ logs }: { logs: LogAuditoria[] }) {
  const ordenados = [...logs].sort((a, b) => b.created_at.localeCompare(a.created_at))

  if (ordenados.length === 0) {
    return <p className="text-sm text-muted-foreground">Sin registros.</p>
  }

  return (
    <ol className="flex flex-col gap-3">
      {ordenados.map((log) => {
        const Icono = ICONOS[log.tipo]
        const esRespuesta = log.tipo === 'aprobacion' || log.tipo === 'rechazo'
        return (
          <li
            key={log.id}
            className={cn(
              'flex gap-3 rounded-lg border bg-card p-3',
              log.tipo === 'aprobacion' && 'border-2 border-status-ready',
              log.tipo === 'rechazo' && 'border-2 border-status-repair',
            )}
          >
            <Icono
              className={cn(
                'mt-0.5 size-5 shrink-0',
                log.tipo === 'aprobacion' && 'text-status-ready',
                log.tipo === 'rechazo' && 'text-status-repair',
              )}
              aria-hidden="true"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="font-semibold">{log.descripcion}</p>
                <time dateTime={log.created_at} className="font-mono text-xs text-muted-foreground">
                  {`${formatFecha(log.created_at)} · ${formatHora(log.created_at)}`}
                </time>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">{ACTOR[log.actor]}</span>
                {log.estado_nuevo && (
                  <span className="flex items-center gap-1.5">
                    {log.estado_anterior && (
                      <>
                        <StatusBadge estado={log.estado_anterior} className="text-[11px]" />
                        <ArrowRight className="size-3" aria-hidden="true" />
                      </>
                    )}
                    <StatusBadge estado={log.estado_nuevo} className="text-[11px]" />
                  </span>
                )}
              </div>
              {esRespuesta && (
                <dl className="mt-1 grid grid-cols-2 gap-2 rounded-md bg-muted p-2.5 text-xs sm:grid-cols-4">
                  <div className="col-span-2 flex items-center gap-1.5 font-semibold sm:col-span-4">
                    <ShieldCheck className="size-4" aria-hidden="true" />
                    Prueba digital del cliente
                  </div>
                  <Dato label="Fecha" valor={formatFecha(log.created_at)} />
                  <Dato label="Hora" valor={formatHora(log.created_at)} />
                  <Dato label="Estado" valor={log.tipo === 'aprobacion' ? 'Aprobado' : 'Rechazado'} />
                  <Dato label="IP" valor={log.ip ?? '—'} />
                </dl>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function Dato({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate font-mono font-bold text-foreground">{valor}</dd>
    </div>
  )
}
