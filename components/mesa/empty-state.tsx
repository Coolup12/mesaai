import { Building2, FileText, Globe, MapPin, Network, PenTool } from 'lucide-react'
import { MesaOrb } from '@/components/mesa/mesa-orb'
import { LAUNCH_APPS } from '@/lib/apps'
import { COUNTRIES } from '@/lib/registries'

const CAPABILITIES = [
  {
    icon: Building2,
    title: 'Register my business',
    hint: 'CIPC · SARS · CSD',
    prompt:
      'Register my business "Kofi House Coffee" on CIPC, SARS and CSD. It is a Private Company (Pty) Ltd in South Africa, industry: coffee shop. Director: Thandi Mokoena.',
  },
  {
    icon: PenTool,
    title: 'Design a logo',
    hint: 'Or attach a sketch',
    prompt: 'Design an original, modern logo for "Kofi House Coffee" — warm terracotta and cream, minimal coffee bean mark.',
  },
  {
    icon: Globe,
    title: 'Build & publish a website',
    hint: 'Domain connected',
    prompt: 'Build a website for "Kofi House Coffee", a specialty coffee shop in Cape Town with a menu, story and contact section.',
  },
  {
    icon: MapPin,
    title: 'Google Business Profile',
    hint: 'Be found on Maps',
    prompt: 'Create a Google Business Profile for "Kofi House Coffee" at 12 Bree Street, Cape Town. Open Mon–Sat 07:00–17:00.',
  },
  {
    icon: FileText,
    title: 'Menu, poster & flyer',
    hint: 'Print-ready',
    prompt: 'Design an original café menu for "Kofi House Coffee" with espresso, flat white, cappuccino and pastries with ZAR prices.',
  },
  {
    icon: Network,
    title: 'Sitemap & wireframe',
    hint: 'For your team',
    prompt: 'Create a sitemap and homepage wireframe for a boutique law firm website.',
  },
]

const QUICK_APPS = ['chrome', 'cipc', 'sars', 'gbp', 'gmail', 'whatsapp', 'namecheap', 'linkedin']

export function EmptyState({ onCommand }: { onCommand: (text: string) => void }) {
  const registryCount = COUNTRIES.reduce((n, c) => n + c.registries.length, 0)
  const apps = LAUNCH_APPS.filter((a) => QUICK_APPS.includes(a.id))

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 pb-6 pt-10 md:pt-16">
      <MesaOrb size="lg" />
      <h1 className="mt-6 text-balance text-center text-3xl font-semibold tracking-tight md:text-4xl">
        What are we building for your business?
      </h1>
      <p className="mt-3 max-w-xl text-pretty text-center text-muted-foreground">
        {`I'm Mesa — I register companies, file tax & supplier profiles, design your brand, and launch your website. Type, talk, or drop a sketch.`}
      </p>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        {`${COUNTRIES.length} countries · ${registryCount} government platforms · always online`}
      </p>

      <ul className="mt-8 grid w-full grid-cols-2 gap-2 md:grid-cols-3">
        {CAPABILITIES.map((c) => (
          <li key={c.title}>
            <button
              type="button"
              onClick={() => onCommand(c.prompt)}
              className="group flex h-full w-full flex-col items-start gap-2 rounded-xl border border-border bg-card/60 p-3 text-left transition-colors hover:border-primary/50 hover:bg-card"
            >
              <c.icon className="size-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium">{c.title}</span>
              <span className="text-xs text-muted-foreground">{c.hint}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 w-full">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Command Mesa to open</p>
        <ul className="flex flex-wrap gap-2">
          {apps.map((app) => {
            let host = app.url
            try {
              host = new URL(app.url).host
            } catch {}
            return (
              <li key={app.id}>
                <button
                  type="button"
                  onClick={() => onCommand(app.command)}
                  className="flex items-center gap-2 rounded-full border border-border bg-card/60 py-1 pl-1 pr-3 text-xs transition-colors hover:border-primary/50"
                >
                  <img src={`https://www.google.com/s2/favicons?domain=${host}&sz=32`} alt="" className="size-5 rounded-full bg-secondary p-0.5" />
                  {app.name}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
