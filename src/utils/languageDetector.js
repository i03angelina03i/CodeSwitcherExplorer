const NUMBER = /^[-+]?\d+(?:[.,:]\d+)?$/
const PUNCTUATION = /^[\p{P}\p{S}]+$/u
const LANGUAGE_MAP = {
  de: 'de',
  ru: 'ru',
  unknown: 'unknown',
}
const GERMAN_STOPWORDS = new Set([
  'der', 'die', 'das', 'und', 'oder', 'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'ist', 'sind', 'bin', 'bist', 'war', 'waren', 'nicht', 'mit', 'bei', 'ein', 'eine', 'einen', 'einem', 'einer', 'eines', 'zu', 'im', 'am', 'von', 'für', 'auf', 'aus', 'nach', 'vor', 'durch', 'ohne', 'gegen', 'über', 'unter', 'den', 'dem', 'des', 'wenn', 'weil', 'dass', 'aber', 'doch', 'denn', 'heute', 'morgen', 'gestern', 'gehen', 'geht', 'kommen', 'kommt', 'haben', 'hat', 'habe', 'hast', 'wird', 'werden', 'kann', 'können', 'möchte', 'möchten', 'wo', 'wie', 'was', 'wer', 'wann'
])
const GERMAN_CHARS = /[äöüß]/u
const CYRILLIC = /[\u0400-\u04FF]/u
const LATIN = /[A-Za-zÀ-ÿ]/u

function normalizeText(text) {
  return text
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\u2060]/gu, '')
    .replace(/\s+/gu, ' ')
    .trim()
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

function tokenize(text) {
  return normalizeText(text).match(/\S+/gu) || []
}

function detectLanguage(token) {
  if (!token) return LANGUAGE_MAP.unknown
  const stripped = token.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, '')
  if (!stripped) return LANGUAGE_MAP.unknown
  if (NUMBER.test(stripped)) return LANGUAGE_MAP.unknown
  if (PUNCTUATION.test(stripped)) return LANGUAGE_MAP.unknown

  const normalized = stripped.toLowerCase()
  if (CYRILLIC.test(stripped)) return LANGUAGE_MAP.ru
  if (GERMAN_CHARS.test(stripped) || GERMAN_STOPWORDS.has(normalized)) return LANGUAGE_MAP.de
  if (LATIN.test(stripped)) return LANGUAGE_MAP.de
  return LANGUAGE_MAP.unknown
}

function classifyToken(token, index) {
  return {
    id: index + 1,
    word: token,
    language: detectLanguage(token),
    confidence: 0.78,
    sentence: 0,
    position: index + 1,
  }
}

export function analyzeTokens(text) {
  return tokenize(text).map(classifyToken)
}

export function analyzeText(text) {
  const cleaned = normalizeText(text)
  const tokens = analyzeTokens(cleaned)
  const sentences = splitSentences(cleaned)
  const sentenceTokens = []
  let tokenCursor = 0

  sentences.forEach((sentence, sentenceIndex) => {
    const words = sentence.match(/\S+/gu) || []
    const sentenceTokenIds = []

    words.forEach((word, wordIndex) => {
      const token = tokens[tokenCursor + wordIndex]
      if (token) {
        token.sentence = sentenceIndex + 1
        token.position = wordIndex + 1
        sentenceTokenIds.push(token.id)
      }
    })

    tokenCursor += words.length
    sentenceTokens.push({ sentence, sentenceIndex: sentenceIndex + 1, tokenIds: sentenceTokenIds })
  })

  const switches = []
  tokens.forEach((token, index) => {
    const previous = tokens[index - 1]
    const isSwitch = Boolean(previous && previous.language !== 'unknown' && token.language !== 'unknown' && previous.language !== token.language)
    if (isSwitch) {
      switches.push({ from: previous.language, to: token.language, tokenId: token.id })
    }
  })

  const summary = {
    total: tokens.length,
    sentences: sentences.length,
    uniqueWords: new Set(tokens.map((token) => token.word.toLowerCase())).size,
    switches: switches.length,
    languages: [...new Set(tokens.map((token) => token.language).filter((language) => language !== 'unknown'))],
  }

  return { text: cleaned, tokens, sentences: sentenceTokens.map((item, index) => ({ ...item, switchCount: tokens.filter((token) => token.sentence === index + 1 && token.language !== 'unknown').length })) , summary }
}
