'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  clientesIniciales,
  logsIniciales,
  ordenesIniciales,
  vehiculosIniciales,
} from '@/lib/taller/mock-data'
import { ESTADO_CONFIG } from '@/lib/taller/estados'
import { formatMonto } from '@/lib/taller/format'
import type {
  ActorLog,
  Cliente,
  EstadoOrden,
  LogAuditoria,
  NuevoIngreso,
  OrdenDetalle,
  OrdenTrabajo,
  Vehiculo,
} from '@/lib/taller/types'

// Local state stands in for the Supabase tables until the integration is connected.
// Each action maps 1:1 to the insert/update that will run against Supabase.
interface TallerState {
  clientes: Cliente[]
  vehiculos: Vehiculo[]
  ordenes: OrdenTrabajo[]
  logs: LogAuditoria[]
}

interface RespuestaPresupuesto {
  respondido_at: string
  ip: string
}

interface TallerContextValue {
  ordenes: OrdenDetalle[]
  logs: LogAuditoria[]
  notificacion: string | null
  descartarNotificacion: () => void
  cambiarEstado: (ordenId: string, estado: EstadoOrden, actor?: ActorLog) => void
  agregarAdicional: (ordenId: string, concepto: string, monto: number) => Promise<void>
  responderPresupuesto: (
    ordenId: string,
    decision: 'aprobado' | 'rechazado',
    ip: string,
  ) => RespuestaPresupuesto
  crearIngreso: (datos: NuevoIngreso) => string
}

const TallerContext = createContext<TallerContextValue | null>(null)

const nuevoId = (prefijo: string) => `${prefijo}-${crypto.randomUUID().slice(0, 8)}`

export function TallerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TallerState>({
    clientes: clientesIniciales,
    vehiculos: vehiculosIniciales,
    ordenes: ordenesIniciales,
    logs: logsIniciales,
  })
  const [notificacion, setNotificacion] = useState<string | null>(null)

  const descartarNotificacion = useCallback(() => setNotificacion(null), [])

  const cambiarEstado = useCallback(
    (ordenId: string, estado: EstadoOrden, actor: ActorLog = 'mecanico') => {
      const now = new Date().toISOString()
      const logId = nuevoId('log')
      setState((prev) => {
        const orden = prev.ordenes.find((o) => o.id === ordenId)
        if (!orden || orden.estado === estado) return prev
        return {
          ...prev,
          ordenes: prev.ordenes.map((o) =>
            o.id === ordenId ? { ...o, estado, updated_at: now } : o,
          ),
          logs: [
            ...prev.logs,
            {
              id: logId,
              orden_id: ordenId,
              tipo: 'cambio_estado',
              actor,
              descripcion: `Cambio de estado a ${ESTADO_CONFIG[estado].label}`,
              estado_anterior: orden.estado,
              estado_nuevo: estado,
              ip: null,
              created_at: now,
            },
          ],
        }
      })
      setNotificacion(`Estado actualizado: ${ESTADO_CONFIG[estado].label}`)
    },
    [],
  )

  const agregarAdicional = useCallback(async (ordenId: string, concepto: string, monto: number) => {
    const now = new Date().toISOString()
    const adicionalId = nuevoId('adi')
    const logId = nuevoId('log')
    setState((prev) => {
      const orden = prev.ordenes.find((o) => o.id === ordenId)
      if (!orden) return prev
      return {
        ...prev,
        ordenes: prev.ordenes.map((o) =>
          o.id === ordenId
            ? {
                ...o,
                estado: 'esperando_aprobacion',
                updated_at: now,
                adicionales: [
                  ...o.adicionales,
                  {
                    id: adicionalId,
                    concepto,
                    monto,
                    estado: 'pendiente',
                    created_at: now,
                    respondido_at: null,
                    ip_cliente: null,
                  },
                ],
              }
            : o,
        ),
        logs: [
          ...prev.logs,
          {
            id: logId,
            orden_id: ordenId,
            tipo: 'adicional_creado',
            actor: 'mecanico',
            descripcion: `Reparación adicional: ${concepto} (${formatMonto(monto)})`,
            estado_anterior: orden.estado,
            estado_nuevo: 'esperando_aprobacion',
            ip: null,
            created_at: now,
          },
        ],
      }
    })
    setNotificacion('Reparación adicional enviada al cliente')
  }, [])

  const responderPresupuesto = useCallback(
    (ordenId: string, decision: 'aprobado' | 'rechazado', ip: string) => {
      const now = new Date().toISOString()
      const logId = nuevoId('log')
      const estadoNuevo: EstadoOrden = decision === 'aprobado' ? 'en_reparacion' : 'en_revision'
      setState((prev) => {
        const orden = prev.ordenes.find((o) => o.id === ordenId)
        if (!orden) return prev
        return {
          ...prev,
          ordenes: prev.ordenes.map((o) =>
            o.id === ordenId
              ? {
                  ...o,
                  estado: estadoNuevo,
                  updated_at: now,
                  adicionales: o.adicionales.map((a) =>
                    a.estado === 'pendiente'
                      ? { ...a, estado: decision, respondido_at: now, ip_cliente: ip }
                      : a,
                  ),
                }
              : o,
          ),
          logs: [
            ...prev.logs,
            {
              id: logId,
              orden_id: ordenId,
              tipo: decision === 'aprobado' ? 'aprobacion' : 'rechazo',
              actor: 'cliente',
              descripcion:
                decision === 'aprobado'
                  ? 'Presupuesto aprobado por el cliente'
                  : 'Presupuesto rechazado por el cliente',
              estado_anterior: orden.estado,
              estado_nuevo: estadoNuevo,
              ip,
              created_at: now,
            },
          ],
        }
      })
      return { respondido_at: now, ip }
    },
    [],
  )

  const crearIngreso = useCallback((datos: NuevoIngreso) => {
    const now = new Date().toISOString()
    const clienteId = nuevoId('cli')
    const vehiculoId = nuevoId('veh')
    const ordenId = nuevoId('ot')
    const logId = nuevoId('log')
    setState((prev) => ({
      clientes: [
        ...prev.clientes,
        { id: clienteId, nombre: datos.nombre, telefono: datos.telefono, created_at: now },
      ],
      vehiculos: [
        ...prev.vehiculos,
        {
          id: vehiculoId,
          cliente_id: clienteId,
          patente: datos.patente.toUpperCase(),
          modelo: datos.modelo,
        },
      ],
      ordenes: [
        ...prev.ordenes,
        {
          id: ordenId,
          vehiculo_id: vehiculoId,
          falla_inicial: datos.falla_inicial,
          estado: 'en_revision',
          adicionales: [],
          created_at: now,
          updated_at: now,
        },
      ],
      logs: [
        ...prev.logs,
        {
          id: logId,
          orden_id: ordenId,
          tipo: 'ingreso',
          actor: 'admin',
          descripcion: 'Ingreso del vehículo al taller',
          estado_anterior: null,
          estado_nuevo: 'en_revision',
          ip: null,
          created_at: now,
        },
      ],
    }))
    setNotificacion('Ingreso registrado correctamente')
    return ordenId
  }, [])

  const ordenes = useMemo<OrdenDetalle[]>(() => {
    return state.ordenes.flatMap((orden) => {
      const vehiculo = state.vehiculos.find((v) => v.id === orden.vehiculo_id)
      const cliente = vehiculo && state.clientes.find((c) => c.id === vehiculo.cliente_id)
      return vehiculo && cliente ? [{ ...orden, vehiculo, cliente }] : []
    })
  }, [state.ordenes, state.vehiculos, state.clientes])

  const value = useMemo<TallerContextValue>(
    () => ({
      ordenes,
      logs: state.logs,
      notificacion,
      descartarNotificacion,
      cambiarEstado,
      agregarAdicional,
      responderPresupuesto,
      crearIngreso,
    }),
    [
      ordenes,
      state.logs,
      notificacion,
      descartarNotificacion,
      cambiarEstado,
      agregarAdicional,
      responderPresupuesto,
      crearIngreso,
    ],
  )

  return <TallerContext.Provider value={value}>{children}</TallerContext.Provider>
}

export function useTaller() {
  const ctx = useContext(TallerContext)
  if (!ctx) throw new Error('useTaller debe usarse dentro de <TallerProvider>')
  return ctx
}
