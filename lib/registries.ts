export type RegistryKind = 'company' | 'tax' | 'supplier'

export type Registry = {
  name: string
  short: string
  kind: RegistryKind
  url: string
}

export type CountryRegistries = {
  code: string
  country: string
  region: 'Africa' | 'Europe' | 'Americas' | 'Asia-Pacific' | 'Middle East'
  currency: string
  commonEntity: string
  registries: Registry[]
}

export const KIND_LABEL: Record<RegistryKind, string> = {
  company: 'Company registry',
  tax: 'Tax authority',
  supplier: 'Supplier / procurement database',
}

export const COUNTRIES: CountryRegistries[] = [
  {
    code: 'ZA',
    country: 'South Africa',
    region: 'Africa',
    currency: 'ZAR',
    commonEntity: 'Private Company (Pty) Ltd',
    registries: [
      { short: 'CIPC', name: 'Companies and Intellectual Property Commission', kind: 'company', url: 'https://www.cipc.co.za' },
      { short: 'SARS', name: 'South African Revenue Service', kind: 'tax', url: 'https://www.sars.gov.za' },
      { short: 'CSD', name: 'Central Supplier Database', kind: 'supplier', url: 'https://secure.csd.gov.za' },
    ],
  },
  {
    code: 'NG',
    country: 'Nigeria',
    region: 'Africa',
    currency: 'NGN',
    commonEntity: 'Private Limited Company (Ltd)',
    registries: [
      { short: 'CAC', name: 'Corporate Affairs Commission', kind: 'company', url: 'https://www.cac.gov.ng' },
      { short: 'FIRS', name: 'Federal Inland Revenue Service', kind: 'tax', url: 'https://www.firs.gov.ng' },
      { short: 'BPP', name: 'Bureau of Public Procurement', kind: 'supplier', url: 'https://www.bpp.gov.ng' },
    ],
  },
  {
    code: 'KE',
    country: 'Kenya',
    region: 'Africa',
    currency: 'KES',
    commonEntity: 'Private Limited Company',
    registries: [
      { short: 'BRS', name: 'Business Registration Service', kind: 'company', url: 'https://brs.go.ke' },
      { short: 'KRA', name: 'Kenya Revenue Authority', kind: 'tax', url: 'https://www.kra.go.ke' },
      { short: 'PPIP', name: 'Public Procurement Information Portal', kind: 'supplier', url: 'https://tenders.go.ke' },
    ],
  },
  {
    code: 'GH',
    country: 'Ghana',
    region: 'Africa',
    currency: 'GHS',
    commonEntity: 'Private Company Limited by Shares',
    registries: [
      { short: 'ORC', name: 'Office of the Registrar of Companies', kind: 'company', url: 'https://orc.gov.gh' },
      { short: 'GRA', name: 'Ghana Revenue Authority', kind: 'tax', url: 'https://gra.gov.gh' },
      { short: 'PPA', name: 'Public Procurement Authority', kind: 'supplier', url: 'https://ppa.gov.gh' },
    ],
  },
  {
    code: 'BW',
    country: 'Botswana',
    region: 'Africa',
    currency: 'BWP',
    commonEntity: 'Private Company (Pty) Ltd',
    registries: [
      { short: 'CIPA', name: 'Companies and Intellectual Property Authority', kind: 'company', url: 'https://www.cipa.co.bw' },
      { short: 'BURS', name: 'Botswana Unified Revenue Service', kind: 'tax', url: 'https://www.burs.org.bw' },
      { short: 'PPRA', name: 'Public Procurement Regulatory Authority', kind: 'supplier', url: 'https://www.ppadb.co.bw' },
    ],
  },
  {
    code: 'NA',
    country: 'Namibia',
    region: 'Africa',
    currency: 'NAD',
    commonEntity: 'Private Company (Pty) Ltd / Close Corporation',
    registries: [
      { short: 'BIPA', name: 'Business and Intellectual Property Authority', kind: 'company', url: 'https://www.bipa.na' },
      { short: 'NamRA', name: 'Namibia Revenue Agency', kind: 'tax', url: 'https://www.namra.org.na' },
      { short: 'CPBN', name: 'Central Procurement Board of Namibia', kind: 'supplier', url: 'https://www.cpbn.com.na' },
    ],
  },
  {
    code: 'EG',
    country: 'Egypt',
    region: 'Africa',
    currency: 'EGP',
    commonEntity: 'Limited Liability Company (LLC)',
    registries: [
      { short: 'GAFI', name: 'General Authority for Investment and Free Zones', kind: 'company', url: 'https://www.gafi.gov.eg' },
      { short: 'ETA', name: 'Egyptian Tax Authority', kind: 'tax', url: 'https://www.eta.gov.eg' },
    ],
  },
  {
    code: 'GB',
    country: 'United Kingdom',
    region: 'Europe',
    currency: 'GBP',
    commonEntity: 'Private Limited Company (Ltd)',
    registries: [
      { short: 'Companies House', name: 'Companies House', kind: 'company', url: 'https://www.gov.uk/government/organisations/companies-house' },
      { short: 'HMRC', name: 'HM Revenue & Customs', kind: 'tax', url: 'https://www.gov.uk/government/organisations/hm-revenue-customs' },
      { short: 'Find a Tender', name: 'Find a Tender Service', kind: 'supplier', url: 'https://www.find-tender.service.gov.uk' },
    ],
  },
  {
    code: 'IE',
    country: 'Ireland',
    region: 'Europe',
    currency: 'EUR',
    commonEntity: 'Private Company Limited by Shares (LTD)',
    registries: [
      { short: 'CRO', name: 'Companies Registration Office', kind: 'company', url: 'https://cro.ie' },
      { short: 'Revenue', name: 'Revenue Commissioners', kind: 'tax', url: 'https://www.revenue.ie' },
      { short: 'eTenders', name: 'eTenders', kind: 'supplier', url: 'https://www.etenders.gov.ie' },
    ],
  },
  {
    code: 'DE',
    country: 'Germany',
    region: 'Europe',
    currency: 'EUR',
    commonEntity: 'GmbH',
    registries: [
      { short: 'Handelsregister', name: 'Common Register Portal of the German Federal States', kind: 'company', url: 'https://www.handelsregister.de' },
      { short: 'BZSt', name: 'Federal Central Tax Office', kind: 'tax', url: 'https://www.bzst.de' },
      { short: 'e-Vergabe', name: 'Federal e-Procurement Platform', kind: 'supplier', url: 'https://www.evergabe-online.de' },
    ],
  },
  {
    code: 'FR',
    country: 'France',
    region: 'Europe',
    currency: 'EUR',
    commonEntity: 'SAS / SARL',
    registries: [
      { short: 'Guichet unique', name: 'Guichet unique des formalités d’entreprises (INPI)', kind: 'company', url: 'https://formalites.entreprises.gouv.fr' },
      { short: 'DGFiP', name: 'Direction générale des Finances publiques', kind: 'tax', url: 'https://www.impots.gouv.fr' },
      { short: 'PLACE', name: 'Plateforme des achats de l’État', kind: 'supplier', url: 'https://www.marches-publics.gouv.fr' },
    ],
  },
  {
    code: 'NL',
    country: 'Netherlands',
    region: 'Europe',
    currency: 'EUR',
    commonEntity: 'Besloten Vennootschap (BV)',
    registries: [
      { short: 'KVK', name: 'Netherlands Chamber of Commerce', kind: 'company', url: 'https://www.kvk.nl' },
      { short: 'Belastingdienst', name: 'Netherlands Tax Administration', kind: 'tax', url: 'https://www.belastingdienst.nl' },
      { short: 'TenderNed', name: 'TenderNed', kind: 'supplier', url: 'https://www.tenderned.nl' },
    ],
  },
  {
    code: 'EU',
    country: 'European Union',
    region: 'Europe',
    currency: 'EUR',
    commonEntity: 'Varies by member state',
    registries: [
      { short: 'TED', name: 'Tenders Electronic Daily', kind: 'supplier', url: 'https://ted.europa.eu' },
      { short: 'VIES', name: 'VAT Information Exchange System', kind: 'tax', url: 'https://ec.europa.eu/taxation_customs/vies' },
    ],
  },
  {
    code: 'US',
    country: 'United States',
    region: 'Americas',
    currency: 'USD',
    commonEntity: 'LLC / C-Corporation (state level)',
    registries: [
      { short: 'Delaware DoC', name: 'Delaware Division of Corporations (state-level example)', kind: 'company', url: 'https://corp.delaware.gov' },
      { short: 'IRS', name: 'Internal Revenue Service (EIN)', kind: 'tax', url: 'https://www.irs.gov' },
      { short: 'SAM.gov', name: 'System for Award Management', kind: 'supplier', url: 'https://sam.gov' },
    ],
  },
  {
    code: 'CA',
    country: 'Canada',
    region: 'Americas',
    currency: 'CAD',
    commonEntity: 'Federal or Provincial Corporation',
    registries: [
      { short: 'Corporations Canada', name: 'Corporations Canada', kind: 'company', url: 'https://ised-isde.canada.ca/site/corporations-canada/en' },
      { short: 'CRA', name: 'Canada Revenue Agency', kind: 'tax', url: 'https://www.canada.ca/en/revenue-agency.html' },
      { short: 'CanadaBuys', name: 'CanadaBuys', kind: 'supplier', url: 'https://canadabuys.canada.ca' },
    ],
  },
  {
    code: 'BR',
    country: 'Brazil',
    region: 'Americas',
    currency: 'BRL',
    commonEntity: 'Sociedade Limitada (Ltda)',
    registries: [
      { short: 'Receita Federal', name: 'Receita Federal (CNPJ)', kind: 'tax', url: 'https://www.gov.br/receitafederal' },
      { short: 'Compras.gov.br', name: 'Federal Procurement Portal', kind: 'supplier', url: 'https://www.gov.br/compras' },
    ],
  },
  {
    code: 'MX',
    country: 'Mexico',
    region: 'Americas',
    currency: 'MXN',
    commonEntity: 'S.A. de C.V. / S. de R.L.',
    registries: [
      { short: 'SE', name: 'Secretaría de Economía', kind: 'company', url: 'https://www.gob.mx/se' },
      { short: 'SAT', name: 'Servicio de Administración Tributaria', kind: 'tax', url: 'https://www.sat.gob.mx' },
    ],
  },
  {
    code: 'AU',
    country: 'Australia',
    region: 'Asia-Pacific',
    currency: 'AUD',
    commonEntity: 'Proprietary Limited (Pty Ltd)',
    registries: [
      { short: 'ASIC', name: 'Australian Securities & Investments Commission', kind: 'company', url: 'https://asic.gov.au' },
      { short: 'ATO', name: 'Australian Taxation Office', kind: 'tax', url: 'https://www.ato.gov.au' },
      { short: 'AusTender', name: 'AusTender', kind: 'supplier', url: 'https://www.tenders.gov.au' },
    ],
  },
  {
    code: 'NZ',
    country: 'New Zealand',
    region: 'Asia-Pacific',
    currency: 'NZD',
    commonEntity: 'Limited Company (Ltd)',
    registries: [
      { short: 'Companies Office', name: 'New Zealand Companies Office', kind: 'company', url: 'https://companies-register.companiesoffice.govt.nz' },
      { short: 'IRD', name: 'Inland Revenue Department', kind: 'tax', url: 'https://www.ird.govt.nz' },
      { short: 'GETS', name: 'Government Electronic Tender Service', kind: 'supplier', url: 'https://www.gets.govt.nz' },
    ],
  },
  {
    code: 'IN',
    country: 'India',
    region: 'Asia-Pacific',
    currency: 'INR',
    commonEntity: 'Private Limited Company',
    registries: [
      { short: 'MCA', name: 'Ministry of Corporate Affairs', kind: 'company', url: 'https://www.mca.gov.in' },
      { short: 'GST', name: 'Goods and Services Tax Network', kind: 'tax', url: 'https://www.gst.gov.in' },
      { short: 'GeM', name: 'Government e-Marketplace', kind: 'supplier', url: 'https://gem.gov.in' },
    ],
  },
  {
    code: 'SG',
    country: 'Singapore',
    region: 'Asia-Pacific',
    currency: 'SGD',
    commonEntity: 'Private Limited (Pte. Ltd.)',
    registries: [
      { short: 'ACRA', name: 'Accounting and Corporate Regulatory Authority', kind: 'company', url: 'https://www.acra.gov.sg' },
      { short: 'IRAS', name: 'Inland Revenue Authority of Singapore', kind: 'tax', url: 'https://www.iras.gov.sg' },
      { short: 'GeBIZ', name: 'Government Electronic Business', kind: 'supplier', url: 'https://www.gebiz.gov.sg' },
    ],
  },
  {
    code: 'JP',
    country: 'Japan',
    region: 'Asia-Pacific',
    currency: 'JPY',
    commonEntity: 'Kabushiki Kaisha (KK) / Godo Kaisha (GK)',
    registries: [
      { short: 'Legal Affairs Bureau', name: 'Legal Affairs Bureau (Commercial Registration)', kind: 'company', url: 'https://houmukyoku.moj.go.jp' },
      { short: 'NTA', name: 'National Tax Agency', kind: 'tax', url: 'https://www.nta.go.jp' },
    ],
  },
  {
    code: 'AE',
    country: 'United Arab Emirates',
    region: 'Middle East',
    currency: 'AED',
    commonEntity: 'LLC (Mainland) / Free Zone Company',
    registries: [
      { short: 'DET', name: 'Dubai Department of Economy and Tourism', kind: 'company', url: 'https://www.det.gov.ae' },
      { short: 'FTA', name: 'Federal Tax Authority', kind: 'tax', url: 'https://tax.gov.ae' },
    ],
  },
]

export function findCountry(query: string) {
  const q = query.trim().toLowerCase()
  return COUNTRIES.find(
    (c) =>
      c.code.toLowerCase() === q ||
      c.country.toLowerCase() === q ||
      c.country.toLowerCase().includes(q) ||
      c.registries.some((r) => r.short.toLowerCase() === q),
  )
}

export const REGISTRY_SUMMARY = COUNTRIES.map(
  (c) => `${c.country} (${c.code}): ${c.registries.map((r) => `${r.short} [${r.kind}]`).join(', ')}`,
).join('\n')
