import { tagPOS } from './posTagger'

export function calculateStatistics(tokens){
  const total = tokens.length
  const counts = tokens.reduce((acc, t)=>{ acc[t.language] = (acc[t.language]||0)+1; return acc }, {})
  const switches = tokens.filter(t=>t.switchBefore).length
  // POS per language
  const posPerLang = {}
  tokens.forEach(t=>{
    const pos = tagPOS(t.language, t.word)
    posPerLang[t.language] ??= {}
    posPerLang[t.language][pos] = (posPerLang[t.language][pos]||0)+1
  })
  return { total, counts, switches, posPerLang }
}

export function sentenceSwitches(text,tokens){
  const sentences = text.split(/(?<=[.!?])\s+/u).filter(Boolean)
  let cursor=0
  return sentences.map(sentence=>{
    const len = sentence.match(/\S+/gu)?.length||0
    const count = tokens.slice(cursor, cursor+len).filter(t=>t.switchBefore).length
    cursor += len
    return { sentence, count }
  })
}
