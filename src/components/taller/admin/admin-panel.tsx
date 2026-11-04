'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, Clock, ExternalLink, MessageCircle, ShieldCheck, UserPlus, XCircle } from 'lucide-react'
import Link from 'next/link'
import { obtenerIpCliente } from '@/app/actions/auditoria'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Patente, StatusBadge } from '@/components/taller/status-badge'
import { useTaller } from '@/components/taller/taller-provider'
import { formatFecha, formatFechaHora, formatHora, formatMonto, whatsappLink } from '@/lib/taller/format'
import { cn } from '@/lib/utils'
import { AuditLog } from './audit-log'
import { IntakeForm } from './intake-form'
import type { OrdenDetalle } from '@/lib/taller/types'

const DIAS_ALERTA = 3

function diasDesde(iso: string) {
  const inicio = new Date(iso).getTime()
  if (Number.isNaN(inicio)) return 0
  const diff = Date.now() - inicio
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function getAlerta(orden: OrdenDetalle) {
  const pendientes = orden.adicionales.filter((a) => a.estado === 'pendiente')
  if (pendientes.length === 0) return null
  const masAntiguo = pendientes.reduce((ant, act) => (act.created_at < ant ? act.created_at : ant), pendientes[0].created_at)
  const dias = diasDesde(masAntiguo)
  if (dias < DIAS_ALERTA) return null
  return { dias, masAntiguo }
}

export function AdminPanel() {
  const { ordenes, logs, autorizarEstimado } = useTaller()
  const [seleccionId, setSeleccionId] = useState<string | null>(ordenes[0]?.id ?? null)
  const [autorizando, setAutorizando] = useState(false)
  const seleccion = ordenes.find((o) => o.id === seleccionId) ?? ordenes[0]

  const trabajoEnProgreso = ordenes.filter((o) => o.estado === 'en_revision' || o.estado === 'en_reparacion')
  const enInspeccion = ordenes.filter((o) => o.estado === 'en_revision')
  const reparacionesAdicionales = ordenes.flatMap((o) =>
    o.adicionales.map((a) => ({ ...a, orden: o })),
  )
  const nuevosIngresos = [...ordenes].sort((a, b) => b.created_at.localeCompare(a.created_at))
  const alertas = ordenes
    .map((o) => ({ orden: o, alerta: getAlerta(o) }))
    .filter((x): x is { orden: OrdenDetalle; alerta: NonNullable<ReturnType<typeof getAlerta>> } => x.alerta !== null)

  async function aprobarEstimado() {
    if (!seleccion || autorizando) return
    setAutorizando(true)
    try {
      const ip = await obtenerIpCliente()
      autorizarEstimado(seleccion.id, ip)
    } finally {
      setAutorizando(false)
    }
  }

  const pendientesSeleccion = seleccion?.adicionales.filter((a) => a.estado === 'pendiente') ?? []

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-status-approval">Módulo administrador</p>
        <h1 className="text-balance text-3xl font-extrabold md:text-4xl">Tablero de operaciones</h1>
        <p className="text-pretty text-muted-foreground">
          Seguimiento en tiempo real de trabajo en curso, reparaciones adicionales, asignaciones y alertas de estancamiento.
        </p>
      </header>

      {alertas.length > 0 && (
        <section aria-labelledby="alertas-titulo" className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-status-repair" aria-hidden="true" />
            <h2 id="alertas-titulo" className="text-sm font-bold uppercase tracking-[0.2em] text-status-repair">
              Alertas de estancamiento
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {alertas.map(({ orden, alerta }) => (
              <button
                key={orden.id}
                type="button"
                onClick={() => setSeleccionId(orden.id)}
                className="flex items-center justify-between gap-4 rounded-md border-2 border-status-repair bg-status-repair/10 px-4 py-3 text-left transition-colors hover:bg-status-repair/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Patente patente={orden.vehiculo.patente} className="text-sm" />
                    <span className="text-sm font-semibold">{orden.vehiculo.modelo}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{orden.cliente.nombre}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-sm bg-status-repair px-2 py-0.5 text-xs font-bold text-status-repair-foreground">
                    {`${alerta.dias} ${alerta.dias === 1 ? 'día' : 'días'}`}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-status-repair">
                    Sin aprobación
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.9fr)]">
        <Card className="h-fit">
          <CardHeader className="gap-2">
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5 text-status-repair" aria-hidden="true" />
              Trabajo en progreso
            </CardTitle>
            <CardDescription>Órdenes actualmente en inspección o reparación.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {trabajoEnProgreso.length === 0 && <p className="text-sm text-muted-foreground">Sin trabajo en curso.</p>}
            {trabajoEnProgreso.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setSeleccionId(o.id)}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-md border px-3 py-2.5 text-left transition-colors',
                  seleccion?.id === o.id ? 'border-status-approval bg-secondary' : 'border-border hover:bg-secondary/60',
                )}
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Patente patente={o.vehiculo.patente} className="text-xs" />
                    <span className="truncate text-sm font-semibold">{o.vehiculo.modelo}</span>
                  </div>
                  <span className="truncate text-xs text-muted-foreground">{o.cliente.nombre}</span>
                </div>
                <StatusBadge estado={o.estado} className="text-[11px]" />
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader className="gap-2">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-status-approval" aria-hidden="true" />
              Reparaciones adicionales
            </CardTitle>
            <CardDescription>Hallazgos con estado de aprobación.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {reparacionesAdicionales.length === 0 && <p className="text-sm text-muted-foreground">Sin reparaciones adicionales.</p>}
            {reparacionesAdicionales.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setSeleccionId(a.orden.id)}
                className={cn(
                  'flex flex-col gap-2 rounded-md border px-3 py-2.5 text-left transition-colors',
                  seleccion?.id === a.orden.id ? 'border-status-approval bg-secondary' : 'border-border hover:bg-secondary/60',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Patente patente={a.orden.vehiculo.patente} className="text-xs" />
                    <span className="text-xs text-muted-foreground">{a.concepto}</span>
                  </div>
                  <span className="font-mono text-sm font-bold">{formatMonto(a.monto)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Cliente: {a.orden.cliente.nombre}</span>
                  <span
                    className={cn(
                      'rounded-sm px-2 py-0.5 font-bold uppercase tracking-wider',
                      a.estado === 'pendiente' && 'bg-status-approval/15 text-status-approval',
                      a.estado === 'aprobado' && 'bg-status-ready/15 text-status-ready',
                      a.estado === 'rechazado' && 'bg-status-repair/15 text-status-repair',
                    )}
                  >
                    {a.estado === 'pendiente' ? 'Pendiente' : a.estado === 'aprobado' ? 'Aprobado' : 'Rechazado'}
                  </span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader className="gap-2">
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="size-5 text-status-ready" aria-hidden="true" />
              Vehículos recién ingresados
            </CardTitle>
            <CardDescription>Ingreso y asignación de mecánico.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {nuevosIngresos.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setSeleccionId(o.id)}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-md border px-3 py-2.5 text-left transition-colors',
                  seleccion?.id === o.id ? 'border-status-approval bg-secondary' : 'border-border hover:bg-secondary/60',
                )}
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Patente patente={o.vehiculo.patente} className="text-xs" />
                    <span className="truncate text-sm font-semibold">{o.vehiculo.modelo}</span>
                  </div>
                  <span className="truncate text-xs text-muted-foreground">{o.cliente.nombre}</span>
                </div>
                <span
                  className={cn(
                    'rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                    enInspeccion.includes(o)
                      ? 'bg-status-approval/15 text-status-approval'
                      : 'bg-status-ready/15 text-status-ready',
                  )}
                >
                  {enInspeccion.includes(o) ? 'Sin asignar' : 'Asignado'}
                </span>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="flex flex-col gap-6">
          <IntakeForm onCreado={setSeleccionId} />
        </div>

        <div className="grid gap-6">
          {seleccion && (
            <Card>
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
              <CardContent className="flex flex-col gap-6">
                <section className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Presupuestos / reparaciones adicionales
                  </h3>
                  {seleccion.adicionales.length === 0 && (
                    <p className="text-sm text-muted-foreground">Sin reparaciones adicionales registradas.</p>
                  )}
                  <div className="flex flex-col gap-2">
                    {seleccion.adicionales.map((a) => (
                      <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border p-3">
                        <div className="flex flex-col gap-1">
                          <p className="font-semibold">{a.concepto}</p>
                          <p className="text-xs text-muted-foreground">
                            Creado {formatFechaHora(a.created_at)}
                            {a.respondido_at && ` · Respuesta ${formatFechaHora(a.respondido_at)}`}
                            {a.ip_cliente && ` · IP ${a.ip_cliente}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-lg font-bold">{formatMonto(a.monto)}</span>
                          <span
                            className={cn(
                              'rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                              a.estado === 'pendiente' && 'bg-status-approval/15 text-status-approval',
                              a.estado === 'aprobado' && 'bg-status-ready/15 text-status-ready',
                              a.estado === 'rechazado' && 'bg-status-repair/15 text-status-repair',
                            )}
                          >
                            {a.estado === 'pendiente' ? 'Pendiente' : a.estado === 'aprobado' ? 'Aprobado' : 'Rechazado'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {pendientesSeleccion.length > 0 && (
                    <div className="flex flex-col gap-2 rounded-md border-2 border-status-approval bg-status-approval/10 p-4">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="size-5 text-status-approval" aria-hidden="true" />
                        <p className="font-bold">Autorizar estimado</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Podés autorizar el presupuesto en nombre del cliente o junto a él. Esto genera un registro permanente con fecha, hora e IP.
                      </p>
                      <button
                        type="button"
                        disabled={autorizando}
                        onClick={aprobarEstimado}
                        className={cn(
                          buttonVariants(),
                          'h-12 w-fit gap-2 bg-status-ready text-status-ready-foreground hover:bg-status-ready/90 disabled:opacity-60',
                        )}
                      >
                        <CheckCircle2 className="size-5" aria-hidden="true" />
                        {autorizando ? 'Autorizando...' : 'Aprobar estimado'}
                      </button>
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ShieldCheck className="size-4" aria-hidden="true" />
                        Se registrará automáticamente en el historial de auditoría
                      </p>
                    </div>
                  )}
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Historial de auditoría
                  </h3>
                  <AuditLog logs={logs.filter((l) => l.orden_id === seleccion.id)} />
                </section>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
