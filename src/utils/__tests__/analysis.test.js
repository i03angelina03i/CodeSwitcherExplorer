import { describe, expect, it } from 'vitest'
import { analyzeText } from '../languageDetector.js'
import { calculateStatistics } from '../statistics.js'

describe('analyzeText', () => {
  it('detects mixed-language content and sentence switches', () => {
    const result = analyzeText('Heute gehen wir shopping because tomorrow is holiday.')

    expect(result.tokens.length).toBeGreaterThan(0)
    expect(result.tokens.some((token) => token.language === 'en')).toBe(true)
    expect(result.sentences[0].switchCount).toBeGreaterThan(0)
    expect(result.summary.switches).toBeGreaterThan(0)
  })

  it('keeps German words classified as German', () => {
    const result = analyzeText('Heute gehen wir in die Stadt.')
    const germanTokens = result.tokens.filter((token) => token.language === 'de')

    expect(germanTokens.length).toBeGreaterThan(0)
    expect(result.tokens[0].language).toBe('de')
  })

  it('returns empty statistics for blank input', () => {
    const result = analyzeText('   ')

    expect(result.tokens).toHaveLength(0)
    expect(result.summary.total).toBe(0)
    expect(result.summary.languages).toEqual([])
  })
})

describe('calculateStatistics', () => {
  it('computes language counts and percentages', () => {
    const stats = calculateStatistics([
      { language: 'de' },
      { language: 'de' },
      { language: 'en' },
      { language: 'en' },
      { language: 'ru' },
    ])

    expect(stats.total).toBe(5)
    expect(stats.de).toBe(2)
    expect(stats.en).toBe(2)
    expect(stats.ru).toBe(1)
    expect(stats.languagePercents.en).toBe(40)
  })
})
