import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader, askMesaHref } from '@/components/mesa/page-header'
import { LAUNCH_APPS, type LaunchApp } from '@/lib/apps'

export const metadata: Metadata = { title: 'Apps & Sites — Mesa' }

export default function AppsPage() {
  const groups = LAUNCH_APPS.reduce<Record<string, LaunchApp[]>>((acc, app) => {
    ;(acc[app.category] ??= []).push(app)
    return acc
  }, {})

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        eyebrow="Command center"
        title="Tell Mesa to open anything"
        description="Mesa opens Chrome, government portals, Google, social apps and domain hosts for business work — and registers your business on them. Tap an app to send the command."
      />
      <div className="flex flex-col gap-8">
        {Object.entries(groups).map(([category, apps]) => (
          <section key={category}>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">{category}</h2>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {apps.map((app) => {
                const host = new URL(app.url).host
                return (
                  <li key={app.id}>
                    <Link
                      href={askMesaHref(app.command)}
                      className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
                    >
                      <img src={`https://www.google.com/s2/favicons?domain=${host}&sz=64`} alt="" className="size-9 rounded-lg bg-secondary p-1.5" />
                      <span className="font-medium">{app.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">{`"${app.command}"`}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
