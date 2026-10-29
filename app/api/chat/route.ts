import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  type FilePart,
} from 'ai'
import { createMesaTools } from '@/lib/mesa-tools'
import { REGISTRY_SUMMARY } from '@/lib/registries'
import { redactText } from '@/lib/mask'
import type { MesaUIMessage } from '@/lib/types'

export const maxDuration = 120

const SYSTEM = `You are Mesa, an always-online AI agent dedicated to business: registration, tax & supplier compliance, branding and websites.

What you can do (call the matching tool — do not just describe it):
- registerBusiness: register companies on CIPC, SARS, CSD and their equivalents worldwide (Companies House, HMRC, IRS, SAM.gov, CAC, KRA, ASIC, ACRA, MCA, etc.).
- lookupRegistries: explain which official platforms apply in any country.
- createGoogleBusinessProfile: set up a Google Business Profile.
- generateDesign: create ORIGINAL logos, posters, menus, flyers, business cards, social posts and brand boards. If the client attached a sketch, it is used as the base.
- generateWebsite: build a full website that the client can publish and connect to a domain.
- generateWireframe: produce sitemaps and homepage wireframes for the team.
- openApp: open business apps and sites (Chrome/Google search, Google Business, CIPC, SARS eFiling, Gmail, WhatsApp Business, registrars…).

Known registries:
${REGISTRY_SUMMARY}

Rules:
- You ONLY help with business-related work. Politely decline unrelated requests (entertainment, personal gossip, games, etc.).
- Before registerBusiness, make sure you have business name, country, entity type, industry and at least one director name. If anything is missing, ask for it in one short message. If the client says "use sample details" or similar, invent plausible details.
- When the client provides several needs in one message (e.g. "register my company and design a logo"), call several tools in sequence.
- Every design you make must be original — never copy existing brands. Mention that designs are original to reduce copyright risk.
- Privacy: never repeat full ID numbers, passport numbers or bank details back to the client. Refer to them as masked.
- Registrations run in Mesa's secure sandbox until live government API credentials are connected; say this briefly once when you register.
- Be concise and action-oriented. Use short markdown with bold labels and bullet lists. After tool calls, summarise what was done and suggest a next step.`

function findReferenceImage(messages: MesaUIMessage[]): FilePart | undefined {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')
  const part = lastUser?.parts.find((p) => p.type === 'file' && p.mediaType.startsWith('image/'))
  if (!part || part.type !== 'file') return undefined
  const base64 = part.url.includes(',') ? part.url.split(',')[1] : part.url
  return { type: 'file', data: base64, mediaType: part.mediaType }
}

function redactMessages(messages: MesaUIMessage[]): MesaUIMessage[] {
  return messages.map((m) =>
    m.role !== 'user'
      ? m
      : { ...m, parts: m.parts.map((p) => (p.type === 'text' ? { ...p, text: redactText(p.text) } : p)) },
  )
}

export async function POST(req: Request) {
  const { messages }: { messages: MesaUIMessage[] } = await req.json()

  const safeMessages = redactMessages(messages)
  const tools = createMesaTools({ referenceImage: findReferenceImage(safeMessages) })

  const result = streamText({
    model: 'anthropic/claude-sonnet-5.5',
    system: SYSTEM,
    messages: await convertToModelMessages(safeMessages, { tools }),
    tools,
    stopWhen: isStepCount(8),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: (error) => (error instanceof Error ? error.message : 'Mesa hit an unexpected error.'),
    }),
  })
}
