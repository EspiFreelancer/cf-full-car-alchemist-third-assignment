import Link from 'next/link'
import { BrandLogo } from '@/components/taller/brand-logo'
import { cn } from '@/lib/utils'

interface AppHeaderProps {
  titulo: string
  activo?: 'mecanico' | 'admin'
}

const NAV = [
  { href: '/mecanico', label: 'Mecánico', id: 'mecanico' },
  { href: '/admin', label: 'Admin', id: 'admin' },
] as const

export function AppHeader({ titulo, activo }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <BrandLogo priority className="h-10 w-auto rounded-sm" />
          <span className="hidden min-w-0 flex-col leading-tight sm:flex">
            <span className="truncate text-[10px] font-bold uppercase tracking-[0.24em] text-status-approval">
              Taller
            </span>
            <span className="truncate text-sm font-bold">{titulo}</span>
          </span>
        </Link>
        <nav aria-label="Principal" className="flex gap-1">
          {NAV.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              aria-current={activo === item.id ? 'page' : undefined}
              className={cn(
                'rounded-sm px-3 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                activo === item.id
                  ? 'bg-status-repair text-status-repair-foreground'
                  : 'text-muted-foreground hover:bg-card hover:text-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
