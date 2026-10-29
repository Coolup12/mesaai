import { MesaChat } from '@/components/mesa/mesa-chat'

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  return <MesaChat key={q ?? 'new'} initialPrompt={q?.slice(0, 2000)} />
}
