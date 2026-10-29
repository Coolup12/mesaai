import { z } from 'zod'

export const SECTION_TYPES = [
  'nav',
  'hero',
  'features',
  'services',
  'gallery',
  'menu',
  'pricing',
  'stats',
  'testimonials',
  'team',
  'faq',
  'cta',
  'contact',
  'footer',
] as const

export type SectionType = (typeof SECTION_TYPES)[number]

export type SitemapNode = {
  title: string
  path: string
  children?: SitemapNode[]
}

const sitemapLeaf = z.object({ title: z.string(), path: z.string() })

export const wireframeSchema = z.object({
  name: z.string().describe('Short name of the layout, e.g. "Bold Bistro"'),
  industry: z.string(),
  description: z.string().describe('One-sentence summary of the layout strategy'),
  sitemap: z
    .array(
      sitemapLeaf.extend({
        children: z.array(sitemapLeaf).optional(),
      }),
    )
    .describe('Top-level pages, with optional sub-pages'),
  sections: z
    .array(
      z.object({
        type: z.enum(SECTION_TYPES),
        label: z.string().describe('What this block contains, e.g. "Hero with booking CTA"'),
      }),
    )
    .describe('Homepage sections from top to bottom'),
})

export type Wireframe = z.infer<typeof wireframeSchema> & { id: string }

export const WIREFRAME_TEMPLATES: Wireframe[] = [
  {
    id: 'tpl-bistro',
    name: 'Bold Bistro',
    industry: 'Restaurant',
    description: 'Appetite-first layout that pushes reservations and the menu above the fold.',
    sitemap: [
      { title: 'Home', path: '/' },
      { title: 'Menu', path: '/menu', children: [{ title: 'Breakfast', path: '/menu/breakfast' }, { title: 'Dinner', path: '/menu/dinner' }] },
      { title: 'Reservations', path: '/reserve' },
      { title: 'Contact', path: '/contact' },
    ],
    sections: [
      { type: 'nav', label: 'Logo, menu link, Book a table' },
      { type: 'hero', label: 'Full-bleed dish photo with reservation CTA' },
      { type: 'menu', label: 'Signature dishes with prices' },
      { type: 'gallery', label: 'Interior and plating gallery' },
      { type: 'testimonials', label: 'Google review highlights' },
      { type: 'contact', label: 'Map, hours, phone' },
      { type: 'footer', label: 'Socials and legal' },
    ],
  },
  {
    id: 'tpl-consult',
    name: 'Trust Consultancy',
    industry: 'Professional services',
    description: 'Credibility-led layout with proof points and a lead capture form.',
    sitemap: [
      { title: 'Home', path: '/' },
      { title: 'Services', path: '/services', children: [{ title: 'Tax', path: '/services/tax' }, { title: 'Compliance', path: '/services/compliance' }, { title: 'Payroll', path: '/services/payroll' }] },
      { title: 'About', path: '/about' },
      { title: 'Insights', path: '/insights' },
      { title: 'Contact', path: '/contact' },
    ],
    sections: [
      { type: 'nav', label: 'Logo, services dropdown, Book consult' },
      { type: 'hero', label: 'Value proposition and consult CTA' },
      { type: 'stats', label: 'Clients served, years, compliance rate' },
      { type: 'services', label: 'Three service cards' },
      { type: 'team', label: 'Partners and credentials' },
      { type: 'faq', label: 'Common client questions' },
      { type: 'cta', label: 'Free compliance check' },
      { type: 'footer', label: 'Registration numbers and contact' },
    ],
  },
  {
    id: 'tpl-retail',
    name: 'Local Shopfront',
    industry: 'Retail',
    description: 'Product-forward layout that drives store visits and WhatsApp orders.',
    sitemap: [
      { title: 'Home', path: '/' },
      { title: 'Shop', path: '/shop', children: [{ title: 'New arrivals', path: '/shop/new' }, { title: 'Specials', path: '/shop/specials' }] },
      { title: 'Our story', path: '/story' },
      { title: 'Visit us', path: '/visit' },
    ],
    sections: [
      { type: 'nav', label: 'Logo, shop, WhatsApp order button' },
      { type: 'hero', label: 'Seasonal promo banner' },
      { type: 'features', label: 'Delivery, quality, local pride' },
      { type: 'gallery', label: 'Best-selling products grid' },
      { type: 'pricing', label: 'Weekly specials' },
      { type: 'testimonials', label: 'Customer quotes' },
      { type: 'footer', label: 'Address and trading hours' },
    ],
  },
  {
    id: 'tpl-trades',
    name: 'Rapid Trades',
    industry: 'Home services',
    description: 'Conversion layout for plumbers, electricians and cleaners with instant quote.',
    sitemap: [
      { title: 'Home', path: '/' },
      { title: 'Services', path: '/services' },
      { title: 'Areas we serve', path: '/areas' },
      { title: 'Get a quote', path: '/quote' },
    ],
    sections: [
      { type: 'nav', label: 'Logo, emergency phone number' },
      { type: 'hero', label: 'Same-day service + quote form' },
      { type: 'services', label: 'Service list with starting prices' },
      { type: 'stats', label: 'Jobs completed, response time' },
      { type: 'testimonials', label: 'Before/after reviews' },
      { type: 'cta', label: 'Call now banner' },
      { type: 'footer', label: 'Service areas, certifications' },
    ],
  },
  {
    id: 'tpl-saas',
    name: 'Launch Startup',
    industry: 'Technology',
    description: 'Product launch layout with feature storytelling and pricing tiers.',
    sitemap: [
      { title: 'Home', path: '/' },
      { title: 'Product', path: '/product', children: [{ title: 'Features', path: '/product/features' }, { title: 'Integrations', path: '/product/integrations' }] },
      { title: 'Pricing', path: '/pricing' },
      { title: 'Blog', path: '/blog' },
      { title: 'Sign up', path: '/signup' },
    ],
    sections: [
      { type: 'nav', label: 'Logo, product, pricing, Sign up' },
      { type: 'hero', label: 'Headline, product screenshot, dual CTA' },
      { type: 'features', label: 'Feature grid with icons' },
      { type: 'stats', label: 'Usage metrics' },
      { type: 'pricing', label: 'Three pricing tiers' },
      { type: 'faq', label: 'Billing and security FAQ' },
      { type: 'footer', label: 'Links, newsletter' },
    ],
  },
  {
    id: 'tpl-salon',
    name: 'Studio Salon',
    industry: 'Beauty & wellness',
    description: 'Visual-first layout with treatment menu and online booking.',
    sitemap: [
      { title: 'Home', path: '/' },
      { title: 'Treatments', path: '/treatments' },
      { title: 'Gallery', path: '/gallery' },
      { title: 'Book', path: '/book' },
    ],
    sections: [
      { type: 'nav', label: 'Logo, treatments, Book now' },
      { type: 'hero', label: 'Split image with booking CTA' },
      { type: 'services', label: 'Treatment categories' },
      { type: 'gallery', label: 'Instagram-style results grid' },
      { type: 'team', label: 'Stylists' },
      { type: 'contact', label: 'Location and hours' },
      { type: 'footer', label: 'Socials' },
    ],
  },
]
