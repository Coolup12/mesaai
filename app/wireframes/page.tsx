import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader, askMesaHref } from '@/components/mesa/page-header'
import { WireframeView } from '@/components/mesa/wireframe-view'
import { WIREFRAME_TEMPLATES } from '@/lib/wireframe'

export const metadata: Metadata = { title: 'Wireframes & Sitemaps — Mesa' }

export default function WireframesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        eyebrow="Team board"
        title="Wireframes & sitemaps"
        description="Clients pick the structure they like most. Your team takes the chosen wireframe and Mesa generates the custom site from it."
      />

      <Button asChild className="mb-8">
        <Link href={askMesaHref('Create a new sitemap and homepage wireframe for my business. Ask me my industry first if needed.')}>
          <Sparkles className="size-4" /> Generate a new wireframe
        </Link>
      </Button>

      <ul className="grid gap-5 md:grid-cols-2">
        {WIREFRAME_TEMPLATES.map((w) => {
          const structure = w.sections.map((s) => `${s.type}: ${s.label}`).join('; ')
          return (
            <li key={w.id} className="flex flex-col rounded-2xl border border-border bg-card p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{w.name}</h2>
                  <p className="text-sm text-muted-foreground">{w.description}</p>
                </div>
                <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs">{w.industry}</span>
              </div>
              <div className="flex-1">
                <WireframeView sitemap={w.sitemap} sections={w.sections} />
              </div>
              <div className="mt-5 flex gap-2">
                <Button asChild size="sm">
                  <Link href={askMesaHref(`Build a ${w.industry} website from the "${w.name}" wireframe. Follow these sections in order: ${structure}.`)}>
                    Build this site
                  </Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link href={askMesaHref(`Create a variation of the "${w.name}" ${w.industry} wireframe with a different section order.`)}>
                    Remix
                  </Link>
                </Button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
