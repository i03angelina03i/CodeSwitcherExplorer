export function detectSwitches(tokens){
  return tokens.map((token,i)=>{
    const prev = tokens[i-1]
    const isSwitch = Boolean(prev && token.language !== prev.language && token.language !== 'Unknown' && prev.language !== 'Unknown' && token.language !== 'Punctuation' && prev.language !== 'Punctuation')
    return {...token, switchBefore: isSwitch}
  })
}

export function getSwitchPositions(tokens){
  return detectSwitches(tokens).filter(t=>t.switchBefore).map(t=>t.id)
}
