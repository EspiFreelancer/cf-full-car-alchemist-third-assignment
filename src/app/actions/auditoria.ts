'use server'

import { headers } from 'next/headers'

export async function obtenerIpCliente(): Promise<string> {
  const h = await headers()
  const forwarded = h.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || h.get('x-real-ip') || 'desconocida'
}
