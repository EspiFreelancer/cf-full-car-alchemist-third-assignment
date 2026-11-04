import Link from 'next/link'
import { ArrowRight, LayoutDashboard, Smartphone, UserRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { BrandLogo } from '@/components/taller/brand-logo'
import { cn } from '@/lib/utils'

const VISTAS: {
  href: string
  titulo: string
  descripcion: string
  icono: LucideIcon
  tag: string
  acento: string
}[] = [
  {
    href: '/mecanico',
    titulo: 'Panel del Mecánico',
    descripcion: 'Actualizá el estado del vehículo o sumá una reparación adicional en pocos toques.',
    icono: Smartphone,
    tag: 'Celular',
    acento: 'text-status-repair',
  },
  {
    href: '/cliente/ot-7f3a9c',
    titulo: 'Portal del Cliente',
    descripcion: 'Compartí el link del vehículo con el cliente, sin login ni llamadas.',
    icono: UserRound,
    tag: 'Público',
    acento: 'text-status-ready',
  },
  {
    href: '/admin',
    titulo: 'Administración',
    descripcion: 'Alta rápida de vehículos e historial de aprobaciones con prueba digital.',
    icono: LayoutDashboard,
    tag: 'Escritorio',
    acento: 'text-status-approval',
  },
]

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-9 px-4 py-10 md:max-w-4xl">
      <header className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
        <div className="w-full max-w-sm rounded-md border border-border bg-card p-3 shadow-2xl shadow-black/40">
          <BrandLogo priority className="h-auto w-full" />
        </div>
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-status-approval">
            Taller mecánico
          </p>
          <h1 className="text-balance text-4xl font-extrabold leading-tight md:text-5xl">
            Menos llamadas. Más reparaciones.
          </h1>
          <p className="text-pretty text-lg text-muted-foreground">
            Elegí la vista con la que querés trabajar. Todo el taller, aprobaciones incluidas, en una
            sola pantalla.
          </p>
        </div>
      </header>

      <ul className="grid gap-4 md:grid-cols-3">
        {VISTAS.map(({ href, titulo, descripcion, icono: Icono, tag, acento }) => (
          <li key={href}>
            <Link
              href={href}
              className="group flex h-full min-h-[60px] flex-col gap-4 rounded-md border-2 border-border bg-card p-5 transition-colors hover:border-status-approval hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex size-11 items-center justify-center rounded-sm border border-border bg-background">
                  <Icono className={cn('size-6', acento)} aria-hidden="true" />
                </span>
                <span className="rounded-sm border border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {tag}
                </span>
              </div>
              <span className="text-xl font-bold">{titulo}</span>
              <span className="flex-1 text-sm text-muted-foreground">{descripcion}</span>
              <span className="flex items-center gap-1 text-sm font-bold text-status-approval">
                Abrir
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
