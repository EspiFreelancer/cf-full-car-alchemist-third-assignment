// Shapes mirror the Supabase tables: clientes, vehiculos, ordenes_trabajo, logs_auditoria.

export type EstadoOrden = 'en_revision' | 'esperando_aprobacion' | 'en_reparacion' | 'listo'

export interface Cliente {
  id: string
  nombre: string
  telefono: string
  created_at: string
}

export interface Vehiculo {
  id: string
  cliente_id: string
  patente: string
  modelo: string
}

export type EstadoAdicional = 'pendiente' | 'aprobado' | 'rechazado'

export interface ReparacionAdicional {
  id: string
  concepto: string
  monto: number
  estado: EstadoAdicional
  created_at: string
  respondido_at: string | null
  ip_cliente: string | null
}

export interface OrdenTrabajo {
  id: string
  vehiculo_id: string
  falla_inicial: string
  estado: EstadoOrden
  adicionales: ReparacionAdicional[]
  created_at: string
  updated_at: string
}

export type TipoLog = 'ingreso' | 'cambio_estado' | 'adicional_creado' | 'aprobacion' | 'rechazo'

export type ActorLog = 'admin' | 'mecanico' | 'cliente'

export interface LogAuditoria {
  id: string
  orden_id: string
  tipo: TipoLog
  actor: ActorLog
  descripcion: string
  estado_anterior: EstadoOrden | null
  estado_nuevo: EstadoOrden | null
  ip: string | null
  created_at: string
}

export interface OrdenDetalle extends OrdenTrabajo {
  vehiculo: Vehiculo
  cliente: Cliente
}

export interface NuevoIngreso {
  nombre: string
  telefono: string
  patente: string
  modelo: string
  falla_inicial: string
}
