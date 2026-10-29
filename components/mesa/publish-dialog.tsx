'use client'

import { useEffect, useState } from 'react'
import { Check, Download, ExternalLink, Loader2, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const STEPS = [
  'Checking domain availability',
  'Registering domain',
  'Pointing DNS — A 76.76.21.21 · CNAME cname.vercel-dns.com',
  'Issuing SSL certificate',
  'Deploying to global edge network',
]

export function PublishDialog({ html, suggestedDomain }: { html: string; suggestedDomain: string }) {
  const [domain, setDomain] = useState(suggestedDomain)
  const [step, setStep] = useState(-1)
  const [liveUrl, setLiveUrl] = useState<string | null>(null)

  useEffect(() => {
    if (step < 0 || step >= STEPS.length) return
    const id = setTimeout(() => setStep((s) => s + 1), 900)
    return () => clearTimeout(id)
  }, [step])

  useEffect(() => {
    if (step !== STEPS.length) return
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }))
    setLiveUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [step, html])

  const publishing = step >= 0 && step < STEPS.length
  const live = step === STEPS.length

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Rocket className="size-3.5" /> Publish
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect domain & publish</DialogTitle>
          <DialogDescription>Mesa registers the domain, configures DNS and SSL, then deploys the site.</DialogDescription>
        </DialogHeader>

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (domain.trim()) setStep(0)
          }}
        >
          <label htmlFor="domain" className="sr-only">
            Domain
          </label>
          <Input
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, ''))}
            disabled={step >= 0}
            className="font-mono"
          />
          <Button type="submit" disabled={step >= 0}>
            {publishing ? <Loader2 className="size-4 animate-spin" /> : 'Go live'}
          </Button>
        </form>

        {step >= 0 && (
          <ol className="flex flex-col gap-2" aria-live="polite">
            {STEPS.map((label, i) => (
              <li key={label} className={cn('flex items-center gap-2 text-sm', i > step && 'text-muted-foreground/50')}>
                <span
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full border',
                    i < step ? 'border-success bg-success text-background' : 'border-border',
                  )}
                >
                  {i < step ? <Check className="size-3" strokeWidth={3} /> : i === step ? <Loader2 className="size-3 animate-spin" /> : null}
                </span>
                {label}
              </li>
            ))}
          </ol>
        )}

        {live && (
          <div className="rounded-lg border border-success/40 bg-success/10 p-3">
            <p className="text-sm font-medium text-success">Live at https://{domain}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {liveUrl && (
                <Button asChild size="sm">
                  <a href={liveUrl} target="_blank" rel="noreferrer">
                    Open live site <ExternalLink className="size-3.5" />
                  </a>
                </Button>
              )}
              {liveUrl && (
                <Button asChild size="sm" variant="secondary">
                  <a href={liveUrl} download={`${domain}.html`}>
                    <Download className="size-3.5" /> Download code
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
