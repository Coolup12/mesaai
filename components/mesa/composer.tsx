'use client'

import { useRef, useState } from 'react'
import type { FileUIPart } from 'ai'
import { ArrowUp, ImagePlus, Loader2, Mic, Square, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type Props = {
  busy: boolean
  onSend: (payload: { text: string; files: FileUIPart[]; voiceNote?: { durationSec: number } }) => void
  onStop: () => void
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function Composer({ busy, onSend, onStop }: Props) {
  const [text, setText] = useState('')
  const [files, setFiles] = useState<FileUIPart[]>([])
  const [recording, setRecording] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const recorder = useRef<MediaRecorder | null>(null)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  async function addFiles(list: FileList | null) {
    if (!list) return
    const images = Array.from(list).filter((f) => f.type.startsWith('image/') && f.size < 8 * 1024 * 1024)
    const parts = await Promise.all(
      images.map(async (f) => ({ type: 'file' as const, mediaType: f.type, filename: f.name, url: await readAsDataUrl(f) })),
    )
    setFiles((prev) => [...prev, ...parts].slice(0, 3))
  }

  function submit() {
    const value = text.trim()
    if ((!value && files.length === 0) || busy) return
    onSend({ text: value || 'Turn this sketch into a polished, original logo for my business.', files })
    setText('')
    setFiles([])
  }

  async function startRecording() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const rec = new MediaRecorder(stream)
      const startedAt = Date.now()
      const chunks: Blob[] = []
      rec.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data)
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        const duration = Math.round((Date.now() - startedAt) / 1000)
        const blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' })
        setTranscribing(true)
        try {
          const form = new FormData()
          form.append('audio', blob, 'voice-note.webm')
          const res = await fetch('/api/transcribe', { method: 'POST', body: form })
          const data: { text?: string; error?: string } = await res.json()
          if (!res.ok || !data.text) throw new Error(data.error ?? 'Could not understand the voice note.')
          onSend({ text: data.text, files, voiceNote: { durationSec: duration } })
          setFiles([])
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Voice note failed.')
        } finally {
          setTranscribing(false)
        }
      }
      recorder.current = rec
      rec.start()
      setSeconds(0)
      setRecording(true)
      timer.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } catch {
      setError('Microphone access was blocked. Allow it in your browser to send voice notes.')
    }
  }

  function stopRecording() {
    if (timer.current) clearInterval(timer.current)
    recorder.current?.stop()
    setRecording(false)
  }

  return (
    <div className="w-full">
      <div
        className={cn(
          'rounded-2xl border border-input bg-card p-2 shadow-2xl shadow-black/30 transition-colors focus-within:border-primary/50',
          recording && 'border-primary/60',
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          addFiles(e.dataTransfer.files)
        }}
      >
        {files.length > 0 && (
          <ul className="flex gap-2 px-1 pb-2" aria-label="Attached images">
            {files.map((f, i) => (
              <li key={`${f.filename}-${i}`} className="relative">
                <img src={f.url || '/placeholder.svg'} alt={f.filename ?? 'Attached image'} className="size-14 rounded-lg border border-border object-cover" />
                <button
                  type="button"
                  aria-label={`Remove ${f.filename ?? 'image'}`}
                  onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-foreground text-background"
                >
                  <X className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {recording || transcribing ? (
          <div className="flex min-h-14 items-center gap-3 px-3" role="status">
            {recording ? (
              <>
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
                </span>
                <div className="flex h-6 flex-1 items-center gap-0.5" aria-hidden="true">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-primary/70 animate-orb-pulse"
                      style={{ height: `${20 + ((i * 37) % 80)}%`, animationDelay: `${(i % 8) * 120}ms` }}
                    />
                  ))}
                </div>
                <span className="font-mono text-sm tabular-nums text-muted-foreground">
                  {`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`}
                </span>
              </>
            ) : (
              <span className="shimmer-text text-sm">Mesa is listening to your voice note…</span>
            )}
          </div>
        ) : (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                if (e.nativeEvent.isComposing || e.keyCode === 229) return
                e.preventDefault()
                submit()
              }
            }}
            rows={2}
            placeholder="Command Mesa — register my company on CIPC, SARS & CSD, design a logo, build my site…"
            aria-label="Message Mesa"
            className="max-h-48 min-h-14 w-full resize-none bg-transparent px-3 py-2 text-[15px] leading-relaxed outline-none placeholder:text-muted-foreground"
          />
        )}

        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-1">
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              tabIndex={-1}
              onChange={(e) => {
                addFiles(e.target.files)
                e.target.value = ''
              }}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-muted-foreground"
                  onClick={() => fileInput.current?.click()}
                  disabled={recording}
                  aria-label="Attach a sketch or image"
                >
                  <ImagePlus className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach a sketch — Mesa turns drawings into logos</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant={recording ? 'default' : 'ghost'}
                  size="icon"
                  className={cn('rounded-full', !recording && 'text-muted-foreground')}
                  onClick={recording ? stopRecording : startRecording}
                  disabled={transcribing || busy}
                  aria-label={recording ? 'Stop and send voice note' : 'Record a voice note'}
                >
                  {recording ? <Square className="size-3.5 fill-current" /> : <Mic className="size-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{recording ? 'Stop & send' : 'Send a voice note'}</TooltipContent>
            </Tooltip>
          </div>

          {busy ? (
            <Button type="button" size="icon" className="rounded-full" onClick={onStop} aria-label="Stop Mesa">
              <Square className="size-3.5 fill-current" />
            </Button>
          ) : (
            <Button
              type="button"
              size="icon"
              className="rounded-full"
              onClick={submit}
              disabled={transcribing || recording || (!text.trim() && files.length === 0)}
              aria-label="Send to Mesa"
            >
              {transcribing ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}
            </Button>
          )}
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-2 px-2 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
