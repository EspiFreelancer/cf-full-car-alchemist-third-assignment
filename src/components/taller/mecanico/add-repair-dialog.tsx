'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { Delete, Loader2, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatMonto } from '@/lib/taller/format'
import { cn } from '@/lib/utils'

const CONCEPTOS_RAPIDOS = [
  'Pastillas de freno',
  'Discos de freno',
  'Batería',
  'Amortiguadores',
  'Correa de distribución',
  'Embrague',
]

const TECLAS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const

interface AddRepairDialogProps {
  patente: string
  onGuardar: (concepto: string, monto: number) => Promise<void>
}

export function AddRepairDialog({ patente, onGuardar }: AddRepairDialogProps) {
  const [open, setOpen] = useState(false)
  const [concepto, setConcepto] = useState('')
  const [monto, setMonto] = useState('')
  const [enviando, setEnviando] = useState(false)

  const montoNumero = Number(monto)
  const valido = concepto.trim().length > 0 && Number.isFinite(montoNumero) && montoNumero > 0

  function handleOpenChange(next: boolean) {
    if (enviando && !next) return
    setOpen(next)
    if (!next) {
      setConcepto('')
      setMonto('')
    }
  }

  function agregarDigito(digito: string) {
    setMonto((prev) => {
      if (prev.length >= 9) return prev
      const next = `${prev}${digito}`.replace(/^0+(?=\d)/, '')
      return next
    })
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!valido || enviando) return
    setEnviando(true)
    try {
      await onGuardar(concepto.trim(), Math.round(montoNumero))
      setOpen(false)
      setConcepto('')
      setMonto('')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="h-16 w-full gap-2 bg-status-repair text-lg font-bold text-status-repair-foreground hover:bg-status-repair/90"
      >
        <Plus className="size-6" aria-hidden="true" />
        Agregar Reparación Adicional
      </Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          showCloseButton={!enviando}
          className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="text-xl">Reparación adicional</DialogTitle>
            <DialogDescription>
              {`Vehículo ${patente}. Al solicitar aprobación, el trabajo queda pausado hasta la respuesta del cliente.`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} aria-busy={enviando} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="concepto" className="text-base">
                Concepto
              </Label>
              <div className="flex flex-wrap gap-2">
                {CONCEPTOS_RAPIDOS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setConcepto(c)}
                    aria-pressed={concepto === c}
                    disabled={enviando}
                    className={cn(
                      'min-h-12 rounded-sm border-2 px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60 disabled:opacity-50',
                      concepto === c
                        ? 'border-status-approval bg-status-approval text-status-approval-foreground'
                        : 'border-border bg-card text-foreground hover:bg-secondary',
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <Input
                id="concepto"
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
                placeholder="O escribí un concepto corto"
                maxLength={80}
                disabled={enviando}
                className="h-14 text-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p id="monto-label" className="text-base font-medium">
                Monto ($)
              </p>
              <div
                role="status"
                aria-live="polite"
                aria-labelledby="monto-label"
                className="rounded-md border-2 border-border bg-background px-4 py-3 text-right font-mono text-3xl font-extrabold tracking-wider text-foreground"
              >
                {formatMonto(montoNumero || 0)}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {TECLAS.map((tecla) => (
                  <Tecla key={tecla} onClick={() => agregarDigito(tecla)} disabled={enviando}>
                    {tecla}
                  </Tecla>
                ))}
                <Tecla onClick={() => setMonto((prev) => prev.slice(0, -1))} disabled={enviando} label="Borrar último dígito">
                  <Delete className="size-6" aria-hidden="true" />
                </Tecla>
                <Tecla onClick={() => agregarDigito('0')} disabled={enviando}>
                  0
                </Tecla>
                <Tecla onClick={() => setMonto('')} disabled={enviando} label="Limpiar monto">
                  <X className="size-6" aria-hidden="true" />
                </Tecla>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={!valido || enviando}
                className="h-16 gap-2 bg-status-approval text-base font-bold text-status-approval-foreground hover:bg-status-approval/90"
              >
                {enviando ? (
                  <>
                    <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                    Enviando...
                  </>
                ) : (
                  'Solicitar Aprobación'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={enviando}
                className="h-14 text-base font-bold"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface TeclaProps {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  label?: string
}

function Tecla({ children, onClick, disabled, label }: TeclaProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-14 items-center justify-center rounded-md border-2 border-border bg-card font-mono text-2xl font-bold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60 disabled:opacity-50"
    >
      {children}
    </button>
  )
}
