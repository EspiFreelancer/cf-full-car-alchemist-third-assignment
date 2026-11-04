import { Badge } from '@/components/ui/badge'
import { ESTADO_CONFIG } from '@/lib/taller/estados'
import type { EstadoOrden } from '@/lib/taller/types'
import { cn } from '@/lib/utils'

export function StatusBadge({ estado, className }: { estado: EstadoOrden; className?: string }) {
  const config = ESTADO_CONFIG[estado]
  return (
    <Badge className={cn('h-auto rounded-sm border-transparent px-2.5 py-1 font-semibold', config.solid, className)}>
      {config.label}
    </Badge>
  )
}

export function Patente({ patente, className }: { patente: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center whitespace-nowrap rounded-sm border-2 border-foreground bg-card px-2.5 py-0.5 font-mono text-lg font-bold tracking-widest text-foreground',
        className,
      )}
    >
      {patente}
    </span>
  )
}
