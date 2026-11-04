import type { EstadoOrden } from './types'

export const ESTADOS_ORDEN: EstadoOrden[] = [
  'en_revision',
  'esperando_aprobacion',
  'en_reparacion',
  'listo',
]

interface EstadoConfig {
  label: string
  descripcionCliente: string
  solid: string
  dot: string
  border: string
  ring: string
}

export const ESTADO_CONFIG: Record<EstadoOrden, EstadoConfig> = {
  en_revision: {
    label: 'En Revisión',
    descripcionCliente: 'Nuestro equipo está diagnosticando tu vehículo.',
    solid: 'bg-status-review text-status-review-foreground',
    dot: 'bg-status-review',
    border: 'border-status-review',
    ring: 'ring-status-review/40',
  },
  esperando_aprobacion: {
    label: 'Esperando Aprobación',
    descripcionCliente: 'Necesitamos tu aprobación para continuar con la reparación.',
    solid: 'bg-status-approval text-status-approval-foreground',
    dot: 'bg-status-approval',
    border: 'border-status-approval',
    ring: 'ring-status-approval/40',
  },
  en_reparacion: {
    label: 'En Reparación',
    descripcionCliente: 'Estamos trabajando en tu vehículo.',
    solid: 'bg-status-repair text-status-repair-foreground',
    dot: 'bg-status-repair',
    border: 'border-status-repair',
    ring: 'ring-status-repair/40',
  },
  listo: {
    label: 'Listo',
    descripcionCliente: '¡Tu vehículo está listo para retirar!',
    solid: 'bg-status-ready text-status-ready-foreground',
    dot: 'bg-status-ready',
    border: 'border-status-ready',
    ring: 'ring-status-ready/40',
  },
}
