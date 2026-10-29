import type { SectionType, SitemapNode } from '@/lib/wireframe'
import { cn } from '@/lib/utils'

type Props = {
  sitemap: SitemapNode[]
  sections: { type: SectionType; label: string }[]
  compact?: boolean
}

function SectionBlock({ type, label, compact }: { type: SectionType; label: string; compact?: boolean }) {
  const bar = 'rounded-sm bg-muted-foreground/25'
  const inner = (() => {
    switch (type) {
      case 'nav':
        return (
          <div className="flex items-center justify-between">
            <div className={cn(bar, 'h-2 w-10')} />
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className={cn(bar, 'h-1.5 w-5')} />
              ))}
              <div className="h-2 w-6 rounded-sm bg-primary/70" />
            </div>
          </div>
        )
      case 'hero':
        return (
          <div className="flex flex-col items-center gap-1.5 py-2">
            <div className={cn(bar, 'h-2.5 w-3/5')} />
            <div className={cn(bar, 'h-1.5 w-2/5')} />
            <div className="mt-1 h-2.5 w-12 rounded-sm bg-primary/70" />
          </div>
        )
      case 'features':
      case 'services':
      case 'pricing':
      case 'team':
        return (
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-1 rounded-sm border border-dashed border-muted-foreground/30 p-1.5">
                <div className="size-2 rounded-full bg-muted-foreground/30" />
                <div className={cn(bar, 'h-1.5 w-full')} />
                <div className={cn(bar, 'h-1 w-2/3')} />
              </div>
            ))}
          </div>
        )
      case 'gallery':
        return (
          <div className="grid grid-cols-4 gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-square rounded-sm bg-muted-foreground/20" />
            ))}
          </div>
        )
      case 'menu':
        return (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className={cn(bar, 'h-1.5 w-2/3')} />
                <div className="h-1.5 w-3 rounded-sm bg-primary/50" />
              </div>
            ))}
          </div>
        )
      case 'stats':
        return (
          <div className="flex justify-around">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="h-2.5 w-6 rounded-sm bg-primary/50" />
                <div className={cn(bar, 'h-1 w-8')} />
              </div>
            ))}
          </div>
        )
      default:
        return (
          <div className="flex flex-col gap-1">
            <div className={cn(bar, 'h-1.5 w-1/2')} />
            <div className={cn(bar, 'h-1.5 w-3/4')} />
          </div>
        )
    }
  })()

  return (
    <div className="rounded-md border border-border bg-background/60 p-2">
      {inner}
      {!compact && (
        <p className="mt-1.5 text-[10px] leading-tight text-muted-foreground">
          <span className="font-mono uppercase text-foreground/70">{type}</span> · {label}
        </p>
      )}
    </div>
  )
}

function SitemapTree({ nodes }: { nodes: SitemapNode[] }) {
  return (
    <ul className="flex flex-col gap-1 text-xs">
      {nodes.map((node) => (
        <li key={node.path}>
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            <span className="font-medium">{node.title}</span>
            <span className="font-mono text-[10px] text-muted-foreground">{node.path}</span>
          </div>
          {node.children && node.children.length > 0 && (
            <ul className="ml-[3px] mt-1 flex flex-col gap-1 border-l border-border pl-3">
              {node.children.map((child) => (
                <li key={child.path} className="flex items-center gap-2">
                  <span className="font-medium text-foreground/80">{child.title}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{child.path}</span>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}

export function WireframeView({ sitemap, sections, compact }: Props) {
  return (
    <div className={cn('grid gap-4', compact ? 'grid-cols-1' : 'sm:grid-cols-[1fr_1.4fr]')}>
      {!compact && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Sitemap</p>
          <SitemapTree nodes={sitemap} />
        </div>
      )}
      <div>
        {!compact && (
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Homepage wireframe</p>
        )}
        <div className="flex flex-col gap-1.5">
          {sections.map((s, i) => (
            <SectionBlock key={`${s.type}-${i}`} type={s.type} label={s.label} compact={compact} />
          ))}
        </div>
      </div>
    </div>
  )
}
