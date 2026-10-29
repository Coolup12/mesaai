import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { PageHeader, askMesaHref } from '@/components/mesa/page-header'
import { LIBRARY, type LibraryTopic } from '@/lib/library'

export const metadata: Metadata = { title: 'Business Library — Mesa' }

export default function LibraryPage() {
  const groups = LIBRARY.reduce<Record<string, LibraryTopic[]>>((acc, t) => {
    ;(acc[t.category] ??= []).push(t)
    return acc
  }, {})

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <PageHeader
        eyebrow="Knowledge base"
        title="Everything a business owner needs to know"
        description="Registration, tax, branding, online presence, growth and funding — distilled. Tap any guide to have Mesa apply it to your business."
      />
      <div className="flex flex-col gap-10">
        {Object.entries(groups).map(([category, topics]) => (
          <section key={category}>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">{category}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {topics.map((t) => (
                <article key={t.id} className="flex flex-col rounded-2xl border border-border bg-card p-5">
                  <h3 className="font-semibold">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.summary}</p>
                  <ul className="mt-4 flex flex-1 flex-col gap-2 text-sm leading-relaxed">
                    {t.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={askMesaHref(t.askMesa)}
                    className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-medium text-primary hover:underline"
                  >
                    <Sparkles className="size-3.5" /> Ask Mesa
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
