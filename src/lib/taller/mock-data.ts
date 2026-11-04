import type { Cliente, LogAuditoria, OrdenTrabajo, Vehiculo } from './types'

export const clientesIniciales: Cliente[] = [
  { id: 'cli-1', nombre: 'Martina López', telefono: '+54 9 11 5555-1201', created_at: '2026-10-27T12:10:00.000Z' },
  { id: 'cli-2', nombre: 'Javier Romero', telefono: '+54 9 11 5555-3344', created_at: '2026-10-27T13:30:00.000Z' },
  { id: 'cli-3', nombre: 'Lucía Fernández', telefono: '+54 9 11 5555-7788', created_at: '2026-10-28T11:05:00.000Z' },
  { id: 'cli-4', nombre: 'Diego Paz', telefono: '+54 9 11 5555-9021', created_at: '2026-10-28T12:40:00.000Z' },
]

export const vehiculosIniciales: Vehiculo[] = [
  { id: 'veh-1', cliente_id: 'cli-1', patente: 'AE 482 KT', modelo: 'Toyota Corolla 2021' },
  { id: 'veh-2', cliente_id: 'cli-2', patente: 'AC 117 MJ', modelo: 'Volkswagen Amarok 2019' },
  { id: 'veh-3', cliente_id: 'cli-3', patente: 'AF 903 RS', modelo: 'Fiat Cronos 2023' },
  { id: 'veh-4', cliente_id: 'cli-4', patente: 'OKP 552', modelo: 'Ford Focus 2015' },
]

export const ordenesIniciales: OrdenTrabajo[] = [
  {
    id: 'ot-7f3a9c',
    vehiculo_id: 'veh-1',
    falla_inicial: 'Ruido metálico al frenar',
    estado: 'esperando_aprobacion',
    adicionales: [
      {
        id: 'adi-1',
        concepto: 'Cambio de discos de freno delanteros',
        monto: 185000,
        estado: 'pendiente',
        created_at: '2026-10-28T14:20:00.000Z',
        respondido_at: null,
        ip_cliente: null,
      },
    ],
    created_at: '2026-10-27T12:10:00.000Z',
    updated_at: '2026-10-28T14:20:00.000Z',
  },
  {
    id: 'ot-2b8d41',
    vehiculo_id: 'veh-2',
    falla_inicial: 'Pierde potencia en subidas',
    estado: 'en_reparacion',
    adicionales: [
      {
        id: 'adi-2',
        concepto: 'Reemplazo de filtro de combustible',
        monto: 42000,
        estado: 'aprobado',
        created_at: '2026-10-27T16:00:00.000Z',
        respondido_at: '2026-10-27T16:12:44.000Z',
        ip_cliente: '181.47.112.9',
      },
    ],
    created_at: '2026-10-27T13:30:00.000Z',
    updated_at: '2026-10-27T16:12:44.000Z',
  },
  {
    id: 'ot-c94e07',
    vehiculo_id: 'veh-3',
    falla_inicial: 'Testigo de motor encendido',
    estado: 'en_revision',
    adicionales: [],
    created_at: '2026-10-28T11:05:00.000Z',
    updated_at: '2026-10-28T11:05:00.000Z',
  },
  {
    id: 'ot-5a1f6e',
    vehiculo_id: 'veh-4',
    falla_inicial: 'Service de 60.000 km',
    estado: 'listo',
    adicionales: [],
    created_at: '2026-10-28T12:40:00.000Z',
    updated_at: '2026-10-28T17:55:00.000Z',
  },
]

export const logsIniciales: LogAuditoria[] = [
  { id: 'log-1', orden_id: 'ot-7f3a9c', tipo: 'ingreso', actor: 'admin', descripcion: 'Ingreso del vehículo al taller', estado_anterior: null, estado_nuevo: 'en_revision', ip: null, created_at: '2026-10-27T12:10:00.000Z' },
  { id: 'log-2', orden_id: 'ot-7f3a9c', tipo: 'adicional_creado', actor: 'mecanico', descripcion: 'Reparación adicional: Cambio de discos de freno delanteros ($ 185.000)', estado_anterior: 'en_revision', estado_nuevo: 'esperando_aprobacion', ip: null, created_at: '2026-10-28T14:20:00.000Z' },
  { id: 'log-3', orden_id: 'ot-2b8d41', tipo: 'ingreso', actor: 'admin', descripcion: 'Ingreso del vehículo al taller', estado_anterior: null, estado_nuevo: 'en_revision', ip: null, created_at: '2026-10-27T13:30:00.000Z' },
  { id: 'log-4', orden_id: 'ot-2b8d41', tipo: 'adicional_creado', actor: 'mecanico', descripcion: 'Reparación adicional: Reemplazo de filtro de combustible ($ 42.000)', estado_anterior: 'en_revision', estado_nuevo: 'esperando_aprobacion', ip: null, created_at: '2026-10-27T16:00:00.000Z' },
  { id: 'log-5', orden_id: 'ot-2b8d41', tipo: 'aprobacion', actor: 'cliente', descripcion: 'Presupuesto aprobado por el cliente', estado_anterior: 'esperando_aprobacion', estado_nuevo: 'en_reparacion', ip: '181.47.112.9', created_at: '2026-10-27T16:12:44.000Z' },
  { id: 'log-6', orden_id: 'ot-c94e07', tipo: 'ingreso', actor: 'admin', descripcion: 'Ingreso del vehículo al taller', estado_anterior: null, estado_nuevo: 'en_revision', ip: null, created_at: '2026-10-28T11:05:00.000Z' },
  { id: 'log-7', orden_id: 'ot-5a1f6e', tipo: 'ingreso', actor: 'admin', descripcion: 'Ingreso del vehículo al taller', estado_anterior: null, estado_nuevo: 'en_revision', ip: null, created_at: '2026-10-28T12:40:00.000Z' },
  { id: 'log-8', orden_id: 'ot-5a1f6e', tipo: 'cambio_estado', actor: 'mecanico', descripcion: 'Cambio de estado', estado_anterior: 'en_revision', estado_nuevo: 'en_reparacion', ip: null, created_at: '2026-10-28T13:15:00.000Z' },
  { id: 'log-9', orden_id: 'ot-5a1f6e', tipo: 'cambio_estado', actor: 'mecanico', descripcion: 'Cambio de estado', estado_anterior: 'en_reparacion', estado_nuevo: 'listo', ip: null, created_at: '2026-10-28T17:55:00.000Z' },
]
