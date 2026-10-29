'use client'

import { useEffect, useState } from 'react'
import {
  Building2,
  Check,
  Download,
  ExternalLink,
  Globe,
  Loader2,
  MapPin,
  Phone,
  Rocket,
  ShieldCheck,
  Clock,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { WireframeView } from '@/components/mesa/wireframe-view'
import { PublishDialog } from '@/components/mesa/publish-dialog'
import type { MesaUIMessage } from '@/lib/types'
import { cn } from '@/lib/utils'

type Part = MesaUIMessage['parts'][number]
type ToolPart<T extends string> = Extract<Part, { type: T }>

function CardShell({
  icon: Icon,
  title,
  subtitle,
  badge,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle?: string
  badge?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold">{title}</h3>
          {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {badge}
      </header>
      <div className="p-4">{children}</div>
    </section>
  )
}

export function WorkingCard({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-card/50 px-4 py-3">
      <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" />
      <span className="shimmer-text text-sm">{label}</span>
    </div>
  )
}

export function ErrorCard({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      {message}
    </div>
  )
}

function useStepper(total: number, delay = 550) {
  const [done, setDone] = useState(0)
  useEffect(() => {
    if (done >= total) return
    const id = setTimeout(() => setDone((d) => d + 1), delay)
    return () => clearTimeout(id)
  }, [done, total, delay])
  return done
}

type RegistrationOutput = Extract<ToolPart<'tool-registerBusiness'>, { state: 'output-available' }>['output']

function RegistryProgress({ registry }: { registry: RegistrationOutput['registries'][number] }) {
  const done = useStepper(registry.steps.length)
  const complete = done >= registry.steps.length
  return (
    <li className="rounded-lg border border-border bg-background/50 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{registry.short}</p>
          <p className="truncate text-xs text-muted-foreground">{registry.kindLabel}</p>
        </div>
        {complete ? (
          <Badge className="bg-success/15 text-success hover:bg-success/15">Registered</Badge>
        ) : (
          <Badge variant="outline" className="gap-1">
            <Loader2 className="size-3 animate-spin" /> Filing
          </Badge>
        )}
      </div>
      <ol className="mt-3 flex flex-col gap-1.5">
        {registry.steps.map((step, i) => (
          <li key={step} className={cn('flex items-center gap-2 text-xs', i < done ? 'text-foreground' : 'text-muted-foreground/60')}>
            <span
              className={cn(
                'flex size-4 items-center justify-center rounded-full border',
                i < done ? 'border-success bg-success text-background' : 'border-border',
              )}
            >
              {i < done && <Check className="size-2.5" strokeWidth={3} />}
            </span>
            {step}
          </li>
        ))}
      </ol>
      {complete && (
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-2">
          <span className="font-mono text-xs">{registry.reference}</span>
          {registry.url && (
            <a href={registry.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              Portal <ExternalLink className="size-3" />
            </a>
          )}
        </div>
      )}
    </li>
  )
}

export function RegistrationCard({ part }: { part: ToolPart<'tool-registerBusiness'> }) {
  if (part.state === 'output-error') return <ErrorCard message={part.errorText} />
  if (part.state !== 'output-available') return <WorkingCard label="Preparing registration filings…" />
  const o = part.output
  return (
    <CardShell
      icon={Building2}
      title={o.businessName}
      subtitle={`${o.entityType} · ${o.country} · ${o.industry}`}
      badge={<Badge variant="outline">Secure sandbox</Badge>}
    >
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {o.registries.map((r) => (
          <RegistryProgress key={r.short} registry={r} />
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="size-3.5 text-success" /> Directors:
        </span>
        {o.directors.map((d) => (
          <span key={d.name}>
            {d.name}
            {d.idNumber && <span className="ml-1 font-mono">({d.idNumber})</span>}
          </span>
        ))}
      </div>
    </CardShell>
  )
}

export function GoogleProfileCard({ part }: { part: ToolPart<'tool-createGoogleBusinessProfile'> }) {
  if (part.state === 'output-error') return <ErrorCard message={part.errorText} />
  if (part.state !== 'output-available') return <WorkingCard label="Creating Google Business Profile…" />
  const o = part.output
  return (
    <CardShell icon={MapPin} title="Google Business Profile" subtitle={o.profileId} badge={<Badge variant="outline">Pending verification</Badge>}>
      <div className="rounded-lg border border-border bg-background/50 p-4">
        <p className="text-lg font-semibold">{o.businessName}</p>
        <p className="text-sm text-primary">
          {o.primaryCategory}
          {o.secondaryCategories?.length ? ` · ${o.secondaryCategories.join(' · ')}` : ''}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{o.description}</p>
        <dl className="mt-3 grid gap-2 text-sm">
          <div className="flex items-start gap-2">
            <dt className="sr-only">Address</dt>
            <MapPin className="mt-0.5 size-4 text-muted-foreground" />
            <dd>{o.address}</dd>
          </div>
          <div className="flex items-start gap-2">
            <dt className="sr-only">Hours</dt>
            <Clock className="mt-0.5 size-4 text-muted-foreground" />
            <dd>{o.hours}</dd>
          </div>
          {o.phone && (
            <div className="flex items-start gap-2">
              <dt className="sr-only">Phone</dt>
              <Phone className="mt-0.5 size-4 text-muted-foreground" />
              <dd>{o.phone}</dd>
            </div>
          )}
          {o.website && (
            <div className="flex items-start gap-2">
              <dt className="sr-only">Website</dt>
              <Globe className="mt-0.5 size-4 text-muted-foreground" />
              <dd>{o.website}</dd>
            </div>
          )}
        </dl>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button asChild size="sm" variant="secondary">
          <a href={o.mapsQuery} target="_blank" rel="noreferrer">
            View on Maps <ExternalLink className="size-3.5" />
          </a>
        </Button>
        <Button asChild size="sm" variant="ghost">
          <a href="https://business.google.com" target="_blank" rel="noreferrer">
            Open Google Business
          </a>
        </Button>
      </div>
    </CardShell>
  )
}

export function DesignCard({ part }: { part: ToolPart<'tool-generateDesign'> }) {
  if (part.state === 'output-error') return <ErrorCard message={part.errorText} />
  if (part.state !== 'output-available')
    return <WorkingCard label={`Designing an original ${part.input?.kind?.replace('-', ' ') ?? 'asset'}…`} />
  const o = part.output
  return (
    <CardShell
      icon={Rocket}
      title={`${o.kind.replace('-', ' ').replace(/^\w/, (c) => c.toUpperCase())} · ${o.businessName}`}
      subtitle={`Original template ${o.templateId}${o.usedReference ? ' · from your sketch' : ''}`}
      badge={<Badge className="bg-success/15 text-success hover:bg-success/15">Copyright-safe</Badge>}
    >
      <img
        src={o.image || '/placeholder.svg'}
        alt={`${o.kind} design for ${o.businessName}`}
        className="mx-auto max-h-[480px] w-auto rounded-lg border border-border"
      />
      <div className="mt-3 flex gap-2">
        <Button asChild size="sm">
          <a href={o.image} download={`${o.businessName}-${o.kind}.png`.replace(/\s+/g, '-').toLowerCase()}>
            <Download className="size-3.5" /> Download PNG
          </a>
        </Button>
      </div>
    </CardShell>
  )
}

export function WebsiteCard({ part }: { part: ToolPart<'tool-generateWebsite'> }) {
  if (part.state === 'output-error') return <ErrorCard message={part.errorText} />
  if (part.state !== 'output-available') return <WorkingCard label="Coding a custom website…" />
  const o = part.output
  return (
    <CardShell icon={Globe} title={`${o.businessName} website`} subtitle={o.suggestedDomain} badge={<PublishDialog html={o.html} suggestedDomain={o.suggestedDomain} />}>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="flex items-center gap-2 border-b border-border bg-secondary px-3 py-1.5">
          <span className="flex gap-1" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-destructive/70" />
            <span className="size-2.5 rounded-full bg-chart-3/80" />
            <span className="size-2.5 rounded-full bg-success/80" />
          </span>
          <span className="flex-1 truncate rounded bg-background/60 px-2 py-0.5 text-center font-mono text-[11px] text-muted-foreground">
            https://{o.suggestedDomain}
          </span>
        </div>
        <iframe
          title={`${o.businessName} website preview`}
          srcDoc={o.html}
          sandbox="allow-scripts"
          className="h-[460px] w-full bg-white"
        />
      </div>
    </CardShell>
  )
}

export function WireframeCard({
  part,
  onBuild,
}: {
  part: ToolPart<'tool-generateWireframe'>
  onBuild: (prompt: string) => void
}) {
  if (part.state === 'output-error') return <ErrorCard message={part.errorText} />
  if (part.state !== 'output-available') return <WorkingCard label="Mapping sitemap & wireframe…" />
  const o = part.output
  const structure = o.sections.map((s) => `${s.type}: ${s.label}`).join('; ')
  return (
    <CardShell icon={Building2} title={o.name} subtitle={`${o.industry} · ${o.id}`}>
      <p className="mb-4 text-sm text-muted-foreground">{o.description}</p>
      <WireframeView sitemap={o.sitemap} sections={o.sections} />
      <Button
        size="sm"
        className="mt-4"
        onClick={() => onBuild(`Build the ${o.industry} website from the "${o.name}" wireframe. Follow these sections in order: ${structure}.`)}
      >
        Build site from this wireframe
      </Button>
    </CardShell>
  )
}

export function OpenAppCard({ part }: { part: ToolPart<'tool-openApp'> }) {
  if (part.state === 'output-error') return <ErrorCard message={part.errorText} />
  if (part.state !== 'output-available') return <WorkingCard label="Launching app…" />
  const o = part.output
  let host = o.url
  try {
    host = new URL(o.url).host
  } catch {}
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <img
        src={`https://www.google.com/s2/favicons?domain=${host}&sz=64`}
        alt=""
        className="size-8 rounded-md bg-secondary p-1"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{o.appName}</p>
        <p className="truncate text-xs text-muted-foreground">{o.purpose}</p>
      </div>
      <Button asChild size="sm">
        <a href={o.url} target="_blank" rel="noreferrer">
          Open <ExternalLink className="size-3.5" />
        </a>
      </Button>
    </div>
  )
}

export function RegistryLookupCard({ part }: { part: ToolPart<'tool-lookupRegistries'> }) {
  if (part.state === 'output-error') return <ErrorCard message={part.errorText} />
  if (part.state !== 'output-available') return <WorkingCard label="Searching global registries…" />
  const o = part.output
  if (!o.found) return null
  return (
    <CardShell icon={Globe} title={`${o.country} registries`} subtitle={`${o.commonEntity} · ${o.currency}`}>
      <ul className="grid gap-2 sm:grid-cols-3">
        {o.registries.map((r) => (
          <li key={r.short}>
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="flex h-full flex-col rounded-lg border border-border bg-background/50 p-3 transition-colors hover:border-primary/50"
            >
              <span className="text-sm font-semibold">{r.short}</span>
              <span className="text-xs text-muted-foreground">{r.name}</span>
              <span className="mt-2 text-[11px] uppercase tracking-wide text-primary">{r.kind}</span>
            </a>
          </li>
        ))}
      </ul>
    </CardShell>
  )
}
