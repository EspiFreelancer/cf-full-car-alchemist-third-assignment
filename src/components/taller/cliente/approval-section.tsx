'use client'

import { useState, useTransition } from 'react'
import { AlertTriangle, CheckCircle2, Loader2, ShieldCheck, XCircle } from 'lucide-react'
import { obtenerIpCliente } from '@/app/actions/auditoria'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useTaller } from '@/components/taller/taller-provider'
import { formatFecha, formatHora, formatMonto } from '@/lib/taller/format'
import type { ReparacionAdicional } from '@/lib/taller/types'

type Decision = 'aprobado' | 'rechazado'

interface Resultado {
  decision: Decision
  respondido_at: string
  ip: string
}

interface ApprovalSectionProps {
  ordenId: string
  pendientes: ReparacionAdicional[]
}

export function ApprovalSection({ ordenId, pendientes }: ApprovalSectionProps) {
  const { responderPresupuesto } = useTaller()
  const [confirmando, setConfirmando] = useState<Decision | null>(null)
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [isPending, startTransition] = useTransition()

  const total = pendientes.reduce((sum, a) => sum + a.monto, 0)

  function confirmar() {
    if (!confirmando || resultado || isPending) return
    const decision = confirmando
    startTransition(async () => {
      const ip = await obtenerIpCliente()
      const registro = responderPresupuesto(ordenId, decision, ip)
      setResultado({ decision, ...registro })
      setConfirmando(null)
    })
  }

  if (resultado) return <ResultadoFinal resultado={resultado} />
  if (pendientes.length === 0) return null

  return (
    <section aria-labelledby="presupuesto-titulo" className="flex flex-col gap-4">
      <Alert className="border-2 border-status-approval bg-status-approval/10 px-4 py-4 text-foreground">
        <AlertTriangle className="text-status-approval" aria-hidden="true" />
        <AlertTitle id="presupuesto-titulo" className="text-lg font-bold text-status-approval">
          Reparación adicional pendiente
        </AlertTitle>
        <AlertDescription className="text-foreground">
          Encontramos un trabajo extra necesario. Revisá el detalle y respondé para que podamos continuar.
        </AlertDescription>
      </Alert>

      <div className="rounded-xl border-2 bg-card">
        <ul className="divide-y">
          {pendientes.map((a) => (
            <li key={a.id} className="flex items-start justify-between gap-4 p-4">
              <span className="font-medium">{a.concepto}</span>
              <span className="shrink-0 font-mono font-bold">{formatMonto(a.monto)}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t-2 bg-muted p-4">
          <span className="text-base font-bold uppercase tracking-wide">Total adicional</span>
          <span className="font-mono text-2xl font-extrabold">{formatMonto(total)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          onClick={() => setConfirmando('aprobado')}
          disabled={isPending}
          className="h-[72px] gap-2 bg-status-ready text-xl font-extrabold text-status-ready-foreground hover:bg-status-ready/90"
        >
          <CheckCircle2 className="size-7" aria-hidden="true" />
          Aprobar Presupuesto
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setConfirmando('rechazado')}
          disabled={isPending}
          className="h-16 gap-2 border-2 border-foreground text-lg font-bold"
        >
          <XCircle className="size-6" aria-hidden="true" />
          Rechazar
        </Button>
      </div>

      <Dialog
        open={confirmando !== null}
        onOpenChange={(open) => {
          if (!open && !isPending) setConfirmando(null)
        }}
      >
        <DialogContent showCloseButton={!isPending} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {confirmando === 'aprobado' ? '¿Confirmás la aprobación?' : '¿Confirmás el rechazo?'}
            </DialogTitle>
            <DialogDescription className="text-base">
              {confirmando === 'aprobado'
                ? `Autorizás al taller a realizar el trabajo adicional por ${formatMonto(total)}.`
                : 'El taller no realizará el trabajo adicional y se comunicará con vos.'}{' '}
              Se registrará la fecha, hora y tu dirección IP como comprobante.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setConfirmando(null)}
              className="h-16 text-base font-bold"
            >
              Volver
            </Button>
            <Button
              type="button"
              disabled={isPending}
              onClick={confirmar}
              className={
                confirmando === 'aprobado'
                  ? 'h-16 bg-status-ready text-base font-bold text-status-ready-foreground hover:bg-status-ready/90'
                  : 'h-16 bg-status-repair text-base font-bold text-status-repair-foreground hover:bg-status-repair/90'
              }
            >
              {isPending ? (
                <>
                  <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                  Guardando...
                </>
              ) : (
                'Sí, confirmar'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}

function ResultadoFinal({ resultado }: { resultado: Resultado }) {
  const aprobado = resultado.decision === 'aprobado'
  return (
    <section
      role="status"
      className={
        aprobado
          ? 'flex flex-col items-center gap-3 rounded-2xl border-4 border-status-ready bg-card p-6 text-center'
          : 'flex flex-col items-center gap-3 rounded-2xl border-4 border-status-repair bg-card p-6 text-center'
      }
    >
      {aprobado ? (
        <CheckCircle2 className="size-14 text-status-ready" aria-hidden="true" />
      ) : (
        <XCircle className="size-14 text-status-repair" aria-hidden="true" />
      )}
      <h2 className="text-2xl font-extrabold">
        {aprobado ? '¡Presupuesto aprobado!' : 'Presupuesto rechazado'}
      </h2>
      <p className="text-pretty text-muted-foreground">
        {aprobado
          ? 'Gracias. Ya estamos trabajando en tu vehículo.'
          : 'Registramos tu respuesta. El taller se comunicará con vos.'}
      </p>
      <dl className="mt-2 grid w-full grid-cols-3 gap-2 rounded-lg bg-muted p-3 text-left text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase text-muted-foreground">Fecha</dt>
          <dd className="font-mono font-bold">{formatFecha(resultado.respondido_at)}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-muted-foreground">Hora</dt>
          <dd className="font-mono font-bold">{formatHora(resultado.respondido_at)}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs font-semibold uppercase text-muted-foreground">IP</dt>
          <dd className="truncate font-mono font-bold">{resultado.ip}</dd>
        </div>
      </dl>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-4" aria-hidden="true" />
        Comprobante digital guardado
      </p>
    </section>
  )
}
