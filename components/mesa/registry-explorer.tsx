'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { askMesaHref } from '@/components/mesa/page-header'
import { COUNTRIES, KIND_LABEL } from '@/lib/registries'
import { cn } from '@/lib/utils'

const REGIONS = ['All', 'Africa', 'Europe', 'Americas', 'Asia-Pacific', 'Middle East'] as const

export function RegistryExplorer() {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState<(typeof REGIONS)[number]>('All')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return COUNTRIES.filter(
      (c) =>
        (region === 'All' || c.region === region) &&
        (!q ||
          c.country.toLowerCase().includes(q) ||
          c.code.toLowerCase() === q ||
          c.registries.some((r) => r.short.toLowerCase().includes(q) || r.name.toLowerCase().includes(q))),
    )
  }, [query, region])

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="registry-search" className="sr-only">
            Search countries or registries
          </label>
          <Input
            id="registry-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a country or platform — e.g. Nigeria, HMRC, SAM"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1" role="group" aria-label="Filter by region">
          {REGIONS.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={region === r}
              onClick={() => setRegion(r)}
              className={cn(
                'rounded-full px-3 py-1 text-xs transition-colors',
                region === r ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground',
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <ul className="grid gap-4 md:grid-cols-2">
        {results.map((c) => (
          <li key={c.code} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">
                  <span className="mr-2 font-mono text-xs text-muted-foreground">{c.code}</span>
                  {c.country}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {c.commonEntity} · {c.currency}
                </p>
              </div>
              <Link
                href={askMesaHref(`Register my business in ${c.country} on ${c.registries.map((r) => r.short).join(', ')}`)}
                className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
              >
                Register here
              </Link>
            </div>
            <ul className="mt-4 flex flex-col gap-2">
              {c.registries.map((r) => (
                <li key={r.short}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 rounded-lg bg-background/50 px-3 py-2 text-sm transition-colors hover:bg-secondary"
                  >
                    <span className="min-w-0">
                      <span className="font-medium">{r.short}</span>
                      <span className="ml-2 truncate text-xs text-muted-foreground">{r.name}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 text-[11px] text-muted-foreground">
                      {KIND_LABEL[r.kind]}
                      <ExternalLink className="size-3" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {results.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          {`No match yet — ask Mesa directly and it will research that country's registries.`}
        </p>
      )}
    </div>
  )
}
