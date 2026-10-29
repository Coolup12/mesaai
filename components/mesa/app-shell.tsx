'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Globe2, LayoutGrid, Network, Palette, Plus, ShieldCheck } from 'lucide-react'
import { MesaOrb } from '@/components/mesa/mesa-orb'
import { useOnline } from '@/hooks/use-online'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/', label: 'Agent', icon: Plus },
  { href: '/studio', label: 'Brand Studio', icon: Palette },
  { href: '/wireframes', label: 'Wireframes', icon: Network },
  { href: '/registries', label: 'Global Registries', icon: Globe2 },
  { href: '/apps', label: 'Apps & Sites', icon: LayoutGrid },
  { href: '/library', label: 'Business Library', icon: BookOpen },
]

function OnlineBadge() {
  const online = useOnline()
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground" role="status">
      <span className={cn('relative flex size-2', online ? 'text-success' : 'text-destructive')}>
        {online && <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60" />}
        <span className="relative inline-flex size-2 rounded-full bg-current" />
      </span>
      {online ? 'Online' : 'Offline'}
    </span>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-dvh overflow-hidden">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex items-center gap-3 px-4 py-5">
          <MesaOrb />
          <div className="flex flex-col">
            <span className="font-semibold leading-none tracking-tight">Mesa</span>
            <span className="mt-1">
              <OnlineBadge />
            </span>
          </div>
        </div>

        <nav aria-label="Main" className="flex flex-1 flex-col gap-0.5 px-2">
          {NAV.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground',
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="m-3 rounded-xl border border-sidebar-border bg-card p-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ShieldCheck className="size-4 text-success" aria-hidden="true" />
            Private by design
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            ID and card numbers are masked before Mesa sees them. Data is sent over encrypted HTTPS only.
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-2 border-b border-border px-3 py-2 md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <MesaOrb size="sm" />
            <span className="font-semibold">Mesa</span>
          </Link>
          <OnlineBadge />
        </header>
        <nav
          aria-label="Main mobile"
          className="flex gap-1 overflow-x-auto border-b border-border px-2 py-1.5 md:hidden"
        >
          {NAV.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'shrink-0 rounded-full px-3 py-1 text-xs',
                  active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
