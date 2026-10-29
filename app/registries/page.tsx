import type { Metadata } from 'next'
import { PageHeader } from '@/components/mesa/page-header'
import { RegistryExplorer } from '@/components/mesa/registry-explorer'

export const metadata: Metadata = { title: 'Global Registries — Mesa' }

export default function RegistriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        eyebrow="Worldwide coverage"
        title="Every CIPC, SARS & CSD — in every country"
        description="Mesa knows the company registry, tax authority and supplier database for each market your clients trade in. Search a country and command Mesa to register."
      />
      <RegistryExplorer />
    </div>
  )
}
