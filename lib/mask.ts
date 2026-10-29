export function maskSensitive(value: string) {
  const digits = value.replace(/\s/g, '')
  if (digits.length <= 4) return '•'.repeat(digits.length)
  return `${'•'.repeat(Math.max(0, digits.length - 4))}${digits.slice(-4)}`
}

const ID_PATTERN = /\b\d{13}\b/g
const CARD_PATTERN = /\b(?:\d[ -]?){13,19}\b/g

export function redactText(text: string) {
  return text.replace(ID_PATTERN, (m) => maskSensitive(m)).replace(CARD_PATTERN, (m) => maskSensitive(m))
}

export function sandboxReference(prefix: string) {
  const year = new Date().getFullYear()
  const n = Math.floor(100000 + Math.random() * 900000)
  return `${prefix}-${year}-${n}`
}
