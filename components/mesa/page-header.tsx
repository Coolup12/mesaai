export function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <header className="mb-8">
      <p className="font-mono text-xs uppercase tracking-widest text-primary">{eyebrow}</p>
      <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 max-w-2xl text-pretty text-muted-foreground">{description}</p>
    </header>
  )
}

export function askMesaHref(prompt: string) {
  return `/?q=${encodeURIComponent(prompt)}`
}
