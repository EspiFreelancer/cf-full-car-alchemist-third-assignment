import type { Metadata } from 'next'
import { AppHeader } from '@/components/taller/app-header'
import { MechanicPanel } from '@/components/taller/mecanico/mechanic-panel'

export const metadata: Metadata = { title: 'Panel del Mecánico — Full Car Alchemist' }

export default function MecanicoPage() {
  return (
    <>
      <AppHeader titulo="Panel del Mecánico" activo="mecanico" />
      <main>
        <MechanicPanel />
      </main>
    </>
  )
}
