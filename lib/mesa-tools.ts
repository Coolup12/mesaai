import { generateText, tool, type FilePart } from 'ai'
import { z } from 'zod'
import { COUNTRIES, findCountry, KIND_LABEL } from '@/lib/registries'
import { maskSensitive, sandboxReference } from '@/lib/mask'
import { wireframeSchema } from '@/lib/wireframe'

const IMAGE_MODEL = 'google/gemini-3.1-flash-image'
const SITE_MODEL = 'anthropic/claude-sonnet-5.5'

type ToolContext = {
  referenceImage?: FilePart
}

const STEP_TEMPLATES: Record<string, string[]> = {
  company: ['Authenticate customer profile', 'Reserve company name', 'Submit directors & MOI', 'Pay filing fee', 'Issue registration certificate'],
  tax: ['Link company registration number', 'Verify director identity', 'Register income tax', 'Assess VAT / PAYE obligations', 'Issue tax reference number'],
  supplier: ['Create supplier profile', 'Verify company & tax status', 'Verify banking details', 'Add commodities & B-BBEE', 'Issue supplier number'],
}

export function createMesaTools(ctx: ToolContext) {
  return {
    registerBusiness: tool({
      description:
        'Register a client business on one or more government platforms (company registry, tax authority, supplier database) in any country. Use for CIPC, SARS, CSD, Companies House, HMRC, IRS, SAM.gov and similar. Always ask for missing essentials (business name, country, director name) before calling.',
      inputSchema: z.object({
        businessName: z.string(),
        country: z.string().describe('Country name or ISO code'),
        entityType: z.string().describe('e.g. Private Company (Pty) Ltd'),
        industry: z.string(),
        directors: z.array(z.object({ name: z.string(), idNumber: z.string().optional() })).min(1),
        targets: z
          .array(z.string())
          .min(1)
          .describe('Registry short names to register on, e.g. ["CIPC","SARS","CSD"]'),
      }),
      execute: async (input) => {
        const country = findCountry(input.country)
        const registries = input.targets.map((target) => {
          const match =
            country?.registries.find((r) => r.short.toLowerCase() === target.toLowerCase()) ??
            COUNTRIES.flatMap((c) => c.registries).find((r) => r.short.toLowerCase() === target.toLowerCase())
          const kind = match?.kind ?? 'company'
          return {
            short: match?.short ?? target,
            name: match?.name ?? target,
            kind,
            kindLabel: KIND_LABEL[kind],
            url: match?.url ?? null,
            steps: STEP_TEMPLATES[kind],
            reference: sandboxReference(`SBX-${(match?.short ?? target).replace(/\W/g, '').slice(0, 4).toUpperCase()}`),
          }
        })
        return {
          mode: 'sandbox' as const,
          businessName: input.businessName,
          country: country?.country ?? input.country,
          entityType: input.entityType,
          industry: input.industry,
          directors: input.directors.map((d) => ({
            name: d.name,
            idNumber: d.idNumber ? maskSensitive(d.idNumber) : null,
          })),
          registries,
        }
      },
    }),

    lookupRegistries: tool({
      description:
        'Look up official business registration, tax and supplier database platforms for a country. Use when a client asks where or how to register in a specific country.',
      inputSchema: z.object({ country: z.string() }),
      execute: async ({ country }) => {
        const match = findCountry(country)
        if (!match) {
          return {
            found: false as const,
            country,
            available: COUNTRIES.map((c) => c.country),
          }
        }
        return { found: true as const, ...match }
      },
    }),

    createGoogleBusinessProfile: tool({
      description: 'Create a Google Business Profile listing for a client business.',
      inputSchema: z.object({
        businessName: z.string(),
        primaryCategory: z.string(),
        secondaryCategories: z.array(z.string()).optional(),
        address: z.string(),
        phone: z.string().optional(),
        website: z.string().optional(),
        hours: z.string().describe('Short opening hours summary, e.g. "Mon–Fri 08:00–17:00, Sat 09:00–13:00"'),
        description: z.string().describe('SEO-friendly business description under 750 characters'),
      }),
      execute: async (input) => ({
        mode: 'sandbox' as const,
        ...input,
        profileId: sandboxReference('SBX-GBP'),
        verification: 'Postcard / video verification pending',
        mapsQuery: `https://www.google.com/maps/search/${encodeURIComponent(`${input.businessName} ${input.address}`)}`,
      }),
    }),

    generateWebsite: tool({
      description:
        'Generate a complete, original, responsive single-page website for a client business. Use when the client asks for a website or landing page, or wants to build from a wireframe.',
      inputSchema: z.object({
        businessName: z.string(),
        industry: z.string(),
        brief: z.string().describe('Audience, offer, tone, colours, sections and any wireframe structure to follow'),
        suggestedDomain: z.string().describe('A suitable domain, e.g. kofihouse.co.za'),
      }),
      execute: async ({ businessName, industry, brief, suggestedDomain }) => {
        const { text } = await generateText({
          model: SITE_MODEL,
          system:
            'You are an elite web designer. Output ONLY a complete HTML document — no markdown fences, no commentary. Use <script src="https://cdn.tailwindcss.com"></script> for styling and Google Fonts if needed. Design an ORIGINAL layout: no copyrighted images, no brand logos, no lorem ipsum. Use CSS gradients, shapes and inline SVG icons instead of external images. Mobile-first, accessible, semantic HTML, realistic copy for the business. Keep total size under 14KB.',
          prompt: `Business: ${businessName}\nIndustry: ${industry}\nBrief: ${brief}`,
        })
        const html = text.replace(/^```(?:html)?\s*/i, '').replace(/```\s*$/, '').trim()
        return { businessName, industry, suggestedDomain, html }
      },
      toModelOutput: ({ output }) => ({
        type: 'text',
        value: `Website for ${output.businessName} generated (${output.html.length} chars). Suggested domain: ${output.suggestedDomain}. The client can preview it and press Publish to connect the domain.`,
      }),
    }),

    generateDesign: tool({
      description:
        'Create an original brand asset image: logo, poster, menu, flyer, business card, social post or brand board. If the client attached a sketch or photo, it is used as the reference automatically.',
      inputSchema: z.object({
        kind: z.enum(['logo', 'poster', 'menu', 'flyer', 'business-card', 'social-post', 'brand-board']),
        businessName: z.string(),
        prompt: z.string().describe('Detailed art direction: style, colours, text to include, layout'),
        aspectRatio: z.enum(['1:1', '3:4', '4:3', '9:16', '16:9']).default('1:1'),
      }),
      execute: async ({ kind, businessName, prompt, aspectRatio }) => {
        const instruction = `Create an ORIGINAL ${kind.replace('-', ' ')} for "${businessName}". ${prompt}. Aspect ratio ${aspectRatio}. Invent a unique composition — do not imitate existing brands, trademarks, mascots or stock templates. Render text crisply and spelled exactly.${
          ctx.referenceImage ? ' Use the attached hand-drawn sketch / image as the core concept and refine it into a polished professional design.' : ''
        }`
        const result = await generateText({
          model: IMAGE_MODEL,
          messages: [
            {
              role: 'user',
              content: ctx.referenceImage
                ? [ctx.referenceImage, { type: 'text', text: instruction }]
                : [{ type: 'text', text: instruction }],
            },
          ],
        })
        const file = result.files.find((f) => f.mediaType.startsWith('image/'))
        if (!file) throw new Error('The design engine did not return an image. Please try again.')
        const image = file.base64.startsWith('data:') ? file.base64 : `data:${file.mediaType};base64,${file.base64}`
        return {
          kind,
          businessName,
          aspectRatio,
          usedReference: Boolean(ctx.referenceImage),
          templateId: sandboxReference('TPL'),
          image,
        }
      },
      toModelOutput: ({ output }) => ({
        type: 'text',
        value: `Original ${output.kind} for ${output.businessName} created (template ${output.templateId})${output.usedReference ? ' from the client sketch' : ''}. It is displayed to the client.`,
      }),
    }),

    generateWireframe: tool({
      description:
        'Produce a sitemap and homepage wireframe for a client website. Use when the client or team asks for a sitemap, wireframe, site structure or layout options.',
      inputSchema: wireframeSchema,
      execute: async (input) => ({ ...input, id: sandboxReference('WF') }),
    }),

    openApp: tool({
      description:
        'Open a business-related website or app for the client (e.g. Chrome/Google search, Google Business, CIPC, SARS eFiling, Gmail, WhatsApp Business, domain registrars). Refuse non-business requests.',
      inputSchema: z.object({
        appName: z.string(),
        url: z.string().describe('Full https URL to open. For Chrome/search use https://www.google.com/search?q=...'),
        purpose: z.string().describe('Why the app is being opened, in one short sentence'),
      }),
      execute: async ({ appName, url, purpose }) => {
        const safeUrl = /^https:\/\//i.test(url) ? url : `https://www.google.com/search?q=${encodeURIComponent(url)}`
        return { appName, url: safeUrl, purpose }
      },
    }),
  }
}

export type MesaTools = ReturnType<typeof createMesaTools>
