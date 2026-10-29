'use client'

import { Streamdown } from 'streamdown'
import { Mic } from 'lucide-react'
import { MesaOrb } from '@/components/mesa/mesa-orb'
import {
  DesignCard,
  GoogleProfileCard,
  OpenAppCard,
  RegistrationCard,
  RegistryLookupCard,
  WebsiteCard,
  WireframeCard,
} from '@/components/mesa/tool-cards'
import type { MesaUIMessage } from '@/lib/types'

export function MessageView({
  message,
  streaming,
  onCommand,
}: {
  message: MesaUIMessage
  streaming: boolean
  onCommand: (text: string) => void
}) {
  if (message.role === 'user') {
    const images = message.parts.filter((p) => p.type === 'file')
    const text = message.parts
      .filter((p) => p.type === 'text')
      .map((p) => p.text)
      .join('\n')
    return (
      <div className="flex flex-col items-end gap-2">
        {images.length > 0 && (
          <div className="flex gap-2">
            {images.map((img, i) =>
              img.type === 'file' ? (
                <img key={i} src={img.url || '/placeholder.svg'} alt={img.filename ?? 'Uploaded image'} className="size-24 rounded-xl border border-border object-cover" />
              ) : null,
            )}
          </div>
        )}
        {text && (
          <div className="max-w-[85%] rounded-2xl rounded-br-md bg-secondary px-4 py-2.5 text-[15px] leading-relaxed">
            {message.metadata?.voiceNote && (
              <span className="mb-1 flex items-center gap-1.5 text-xs text-primary">
                <Mic className="size-3" /> Voice note
                {message.metadata.durationSec ? ` · ${message.metadata.durationSec}s` : ''}
              </span>
            )}
            <p className="whitespace-pre-wrap">{text}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <div className="pt-0.5">
        <MesaOrb size="sm" active={streaming} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {message.parts.map((part, i) => {
          const key = `${message.id}-${i}`
          switch (part.type) {
            case 'text':
              return (
                <div key={key} className="prose-mesa text-[15px] leading-relaxed">
                  <Streamdown>{part.text}</Streamdown>
                </div>
              )
            case 'tool-registerBusiness':
              return <RegistrationCard key={key} part={part} />
            case 'tool-lookupRegistries':
              return <RegistryLookupCard key={key} part={part} />
            case 'tool-createGoogleBusinessProfile':
              return <GoogleProfileCard key={key} part={part} />
            case 'tool-generateDesign':
              return <DesignCard key={key} part={part} />
            case 'tool-generateWebsite':
              return <WebsiteCard key={key} part={part} />
            case 'tool-generateWireframe':
              return <WireframeCard key={key} part={part} onBuild={onCommand} />
            case 'tool-openApp':
              return <OpenAppCard key={key} part={part} />
            default:
              return null
          }
        })}
      </div>
    </div>
  )
}
