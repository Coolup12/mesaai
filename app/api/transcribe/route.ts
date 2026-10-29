import { experimental_transcribe as transcribe } from 'ai'

export const maxDuration = 60

const MAX_BYTES = 10 * 1024 * 1024

export async function POST(req: Request) {
  const form = await req.formData()
  const audio = form.get('audio')
  if (!(audio instanceof Blob) || audio.size === 0) {
    return Response.json({ error: 'No audio received.' }, { status: 400 })
  }
  if (audio.size > MAX_BYTES) {
    return Response.json({ error: 'Voice note is too long.' }, { status: 413 })
  }

  try {
    const { text } = await transcribe({
      model: 'openai/gpt-4o-mini-transcribe',
      audio: new Uint8Array(await audio.arrayBuffer()),
    })
    return Response.json({ text })
  } catch (error) {
    console.error('[mesa] transcription failed', error)
    return Response.json({ error: 'Could not transcribe the voice note.' }, { status: 500 })
  }
}
