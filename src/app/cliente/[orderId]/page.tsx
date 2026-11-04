import type { Metadata } from 'next'
import { ClientPortal } from '@/components/taller/cliente/client-portal'

export const metadata: Metadata = {
  title: 'Estado de tu vehículo — Full Car Alchemist',
  robots: { index: false, follow: false },
}

export default async function ClientePage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  return <ClientPortal orderId={orderId} />
}
