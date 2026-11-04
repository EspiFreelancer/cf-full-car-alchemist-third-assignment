// A fixed time zone keeps server and client renders identical (avoids hydration mismatches).
const TIME_ZONE = 'America/Argentina/Buenos_Aires'

const moneda = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

const fecha = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: TIME_ZONE,
})

const hora = new Intl.DateTimeFormat('es-AR', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: TIME_ZONE,
})

export const formatMonto = (monto: number) => moneda.format(monto)
export const formatFecha = (iso: string) => fecha.format(new Date(iso))
export const formatHora = (iso: string) => hora.format(new Date(iso))
export const formatFechaHora = (iso: string) => `${formatFecha(iso)} ${formatHora(iso)}`

export function whatsappLink(telefono: string, mensaje: string) {
  const digits = telefono.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(mensaje)}`
}
