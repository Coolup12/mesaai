export type LaunchApp = {
  id: string
  name: string
  url: string
  category: 'Government' | 'Google' | 'Social' | 'Domains & Hosting' | 'Commerce' | 'Productivity'
  command: string
}

export const LAUNCH_APPS: LaunchApp[] = [
  { id: 'cipc', name: 'CIPC', url: 'https://www.cipc.co.za', category: 'Government', command: 'Register my company on CIPC' },
  { id: 'sars', name: 'SARS eFiling', url: 'https://www.sarsefiling.co.za', category: 'Government', command: 'Register my business for tax on SARS' },
  { id: 'csd', name: 'CSD', url: 'https://secure.csd.gov.za', category: 'Government', command: 'Register my business as a supplier on CSD' },
  { id: 'companies-house', name: 'Companies House', url: 'https://www.gov.uk/limited-company-formation', category: 'Government', command: 'Register a UK company on Companies House' },
  { id: 'chrome', name: 'Chrome', url: 'https://www.google.com', category: 'Google', command: 'Open Chrome and search for business registration requirements' },
  { id: 'gbp', name: 'Google Business', url: 'https://business.google.com', category: 'Google', command: 'Create a Google Business Profile for my business' },
  { id: 'maps', name: 'Google Maps', url: 'https://maps.google.com', category: 'Google', command: 'Open Google Maps and find competitors near my business' },
  { id: 'gmail', name: 'Gmail', url: 'https://mail.google.com', category: 'Google', command: 'Open Gmail to set up my business email' },
  { id: 'whatsapp', name: 'WhatsApp Business', url: 'https://business.whatsapp.com', category: 'Social', command: 'Open WhatsApp Business to set up my catalogue' },
  { id: 'facebook', name: 'Facebook', url: 'https://www.facebook.com/pages/create', category: 'Social', command: 'Open Facebook and create a business page' },
  { id: 'instagram', name: 'Instagram', url: 'https://www.instagram.com', category: 'Social', command: 'Open Instagram for my business account' },
  { id: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/company/setup/new', category: 'Social', command: 'Open LinkedIn and create a company page' },
  { id: 'vercel', name: 'Vercel', url: 'https://vercel.com', category: 'Domains & Hosting', command: 'Publish my website on Vercel' },
  { id: 'cloudflare', name: 'Cloudflare', url: 'https://dash.cloudflare.com', category: 'Domains & Hosting', command: 'Open Cloudflare to manage my DNS' },
  { id: 'namecheap', name: 'Namecheap', url: 'https://www.namecheap.com', category: 'Domains & Hosting', command: 'Find a domain for my business on Namecheap' },
  { id: 'shopify', name: 'Shopify', url: 'https://www.shopify.com', category: 'Commerce', command: 'Open Shopify to start an online store' },
]
