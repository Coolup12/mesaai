'use client'

import { useEffect, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import type { FileUIPart } from 'ai'
import { Composer } from '@/components/mesa/composer'
import { EmptyState } from '@/components/mesa/empty-state'
import { MessageView } from '@/components/mesa/message-view'
import { MesaOrb } from '@/components/mesa/mesa-orb'
import type { MesaUIMessage } from '@/lib/types'

export function MesaChat({ initialPrompt }: { initialPrompt?: string }) {
  const { messages, sendMessage, status, stop, error } = useChat<MesaUIMessage>()
  const bottomRef = useRef<HTMLDivElement>(null)
  const sentInitial = useRef(false)
  const busy = status === 'submitted' || status === 'streaming'

  function send(payload: { text: string; files?: FileUIPart[]; voiceNote?: { durationSec: number } }) {
    sendMessage({
      text: payload.text,
      files: payload.files,
      metadata: payload.voiceNote ? { voiceNote: true, durationSec: payload.voiceNote.durationSec } : undefined,
    })
  }

  useEffect(() => {
    if (initialPrompt && !sentInitial.current) {
      sentInitial.current = true
      sendMessage({ text: initialPrompt })
    }
  }, [initialPrompt, sendMessage])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, status])

  const last = messages[messages.length - 1]

  return (
    <div className="relative flex h-full flex-col">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_70%)]" />
      <div className="relative min-h-0 flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState onCommand={(text) => send({ text })} />
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8" aria-live="polite">
            {messages.map((m) => (
              <MessageView
                key={m.id}
                message={m}
                streaming={busy && m.id === last?.id}
                onCommand={(text) => send({ text })}
              />
            ))}
            {status === 'submitted' && last?.role === 'user' && (
              <div className="flex items-center gap-3">
                <MesaOrb size="sm" active />
                <span className="shimmer-text text-sm">Mesa is thinking…</span>
              </div>
            )}
            {error && (
              <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error.message || 'Something went wrong. Please try again.'}
              </p>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
      <div className="relative mx-auto w-full max-w-3xl px-4 pb-4">
        <Composer busy={busy} onSend={send} onStop={stop} />
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Mesa only works on business tasks. Sensitive numbers are masked end-to-end.
        </p>
      </div>
    </div>
  )
}
