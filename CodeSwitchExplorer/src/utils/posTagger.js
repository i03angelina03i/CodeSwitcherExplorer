import nlp from 'compromise'

// Simple POS tagging strategy:
// - English: use compromise
// - German/Russian: heuristic rules (capitalization for nouns in German, suffixes, pronoun lists)

const GERMAN_PRONOUNS = new Set(['ich','du','er','sie','es','wir','ihr','sie','Sie'])
const RUSSIAN_PRONOUNS = new Set(['я','ты','он','она','оно','мы','вы','они'])

export function tagPOS(language, tokenRaw){
  const token = (tokenRaw||'').replace(/[\\p{P}\\p{S}]+/gu,'')
  if(!token) return 'Other'
  if(language === 'English'){
    const doc = nlp(token)
    if(doc.nouns().out('array').length) return 'Noun'
    if(doc.verbs().out('array').length) return 'Verb'
    if(doc.adjectives().out('array').length) return 'Adjective'
    if(doc.pronouns().out('array').length) return 'Pronoun'
    return 'Other'
  }
  if(language === 'German' || language === 'Latin'){
    const lower = token.toLowerCase()
    if(GERMAN_PRONOUNS.has(lower)) return 'Pronoun'
    if(/^(der|die|das|ein|eine)$/i.test(lower)) return 'Determiner'
    if(/[A-ZÄÖÜ][a-zäöüß]+/.test(token)) return 'Noun'
    if(/(lich|bar|ig|sam|isch|en|end)$/i.test(lower)) return 'Adjective'
    if(/(en|n|t|st)$/i.test(lower)) return 'Verb'
    return 'Other'
  }
  if(language === 'Russian'){
    const lower = token.toLowerCase()
    if(RUSSIAN_PRONOUNS.has(lower)) return 'Pronoun'
    if(/[а-яА-Я]+[а-я]$/u.test(token)){
      if(/(ый|ий|ая|ое|ие|ого|ому|ыми|ых)$/i.test(lower)) return 'Adjective'
      if(/(ть|ти|ть)$/i.test(lower)) return 'Verb'
      return 'Noun'
    }
    return 'Other'
  }
  return 'Other'
}
