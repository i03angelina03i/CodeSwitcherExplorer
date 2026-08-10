// Detects German, English, Russian per token using Cyrillic check and stopword hints
const CYRILLIC = /[\u0400-\u04FF]/
const NUMBER = /^[-+]?\d+(?:[.,:]\d+)?$/
const PUNCTUATION = /^[\p{P}\p{S}]+$/u

const ENGLISH_STOP = new Set(['the','and','is','in','to','it','you','that','of','for','on','with','as','are'])
const GERMAN_STOP = new Set(['der','die','und','ist','zu','den','das','ein','ich','nicht','die','mit','auf','für'])

export function detectLanguage(tokenRaw){
  const token = (tokenRaw||'').replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu,'')
  if(!token) return 'Unknown'
  if(CYRILLIC.test(token)) return 'Russian'
  if(NUMBER.test(token)) return 'Number'
  if(PUNCTUATION.test(token)) return 'Punctuation'
  const lower = token.toLowerCase()
  if(ENGLISH_STOP.has(lower)) return 'English'
  if(GERMAN_STOP.has(lower)) return 'German'
  // fallback: simple character check for Latin letters -> German/English ambiguous
  if(/[A-Za-zÀ-ÿ]/.test(token)) return 'Latin'
  return 'Unknown'
}

export function tokenize(text){
  return text.match(/\S+/gu)||[]
}

export function analyzeTokens(text){
  return tokenize(text).map((word,i)=>({id:i+1,word,language:detectLanguage(word)}))
}
