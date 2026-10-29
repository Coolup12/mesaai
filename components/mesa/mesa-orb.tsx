import { cn } from '@/lib/utils'

export function MesaOrb({ size = 'md', active = false }: { size?: 'sm' | 'md' | 'lg'; active?: boolean }) {
  const dims = size === 'lg' ? 'size-20' : size === 'md' ? 'size-9' : 'size-7'
  return (
    <span aria-hidden="true" className={cn('relative inline-flex shrink-0 items-center justify-center', dims)}>
      <span
        className={cn(
          'absolute inset-0 rounded-full blur-md opacity-70',
          'bg-[conic-gradient(from_0deg,var(--primary),var(--chart-3),var(--primary),var(--chart-4),var(--primary))]',
          active ? 'animate-orb-spin' : 'animate-orb-pulse',
        )}
      />
      <span
        className={cn(
          'absolute inset-[2px] rounded-full animate-orb-spin',
          'bg-[conic-gradient(from_90deg,var(--primary),var(--chart-3),var(--chart-4),var(--primary))]',
        )}
      />
      <span className="absolute inset-[22%] rounded-full bg-background/80 backdrop-blur" />
      <span className="absolute inset-[38%] rounded-full bg-primary" />
    </span>
  )
}
