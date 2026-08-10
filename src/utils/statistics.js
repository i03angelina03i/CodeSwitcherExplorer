const NON_LANGUAGE = new Set(['unknown'])

function sequenceLengths(tokens, language) {
  const lengths = []
  let current = 0
  tokens.forEach(({ language: tokenLanguage }) => {
    if (tokenLanguage === language) current += 1
    else if (current) { lengths.push(current); current = 0 }
  })
  if (current) lengths.push(current)
  return lengths
}

export function calculateStatistics(tokens) {
  const languages = [...new Set(tokens.filter((token) => !NON_LANGUAGE.has(token.language)).map((token) => token.language))]
  const counts = Object.fromEntries(languages.map((language) => [language, tokens.filter((token) => token.language === language).length]))
  const total = tokens.length
  const switches = tokens.filter((token) => token.switchBefore).length
  const langCounts = { de: tokens.filter((token) => token.language === 'de').length, ru: tokens.filter((token) => token.language === 'ru').length, en: tokens.filter((token) => token.language === 'en').length, unknown: tokens.filter((token) => token.language === 'unknown').length }
  const sequence = Object.fromEntries(languages.map((language) => {
    const lengths = sequenceLengths(tokens, language)
    return [language, { longest: Math.max(0, ...lengths), average: lengths.length ? lengths.reduce((sum, value) => sum + value, 0) / lengths.length : 0 }]
  }))
  return { total, ...counts, ...langCounts, languages, switches, languagePercents: Object.fromEntries(languages.map((language) => [language, total ? (counts[language] / total) * 100 : 0])), sequence }
}

export function sentenceSwitches(text, tokens) {
  const sentences = text.split(/(?<=[.!?])\s+/u).filter(Boolean)
  let cursor = 0
  return sentences.map((sentence) => {
    const words = sentence.match(/\S+/gu)?.length || 0
    const chunk = tokens.slice(cursor, cursor + words)
    cursor += words
    return { sentence, count: chunk.filter((token) => token.switchBefore).length }
  })
}
