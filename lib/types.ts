import type { InferUITools, UIDataTypes, UIMessage } from 'ai'
import type { MesaTools } from '@/lib/mesa-tools'

export type MesaMetadata = {
  voiceNote?: boolean
  durationSec?: number
}

export type MesaUIMessage = UIMessage<MesaMetadata, UIDataTypes, InferUITools<MesaTools>>
