const NON_LANGUAGE = new Set(['unknown'])

export function detectSwitches(tokens) {
  return tokens.map((token, index) => {
    const previous = tokens[index - 1]
    const isSwitch = Boolean(previous && !NON_LANGUAGE.has(token.language) && !NON_LANGUAGE.has(previous.language) && token.language !== previous.language)
    return { ...token, switchBefore: isSwitch }
  })
}

export function getSwitchPositions(tokens) {
  return detectSwitches(tokens).filter((token) => token.switchBefore).map((token) => token.id)
}
