/**
 * Lightweight SplitText utility.
 * Wraps each character in a <span class="char"> for GSAP targeting.
 * Returns { chars: NodeList, revert: () => void }
 */
export function splitTextToChars(element) {
  if (!element) return { chars: [], revert: () => {} }
  const originalHTML = element.innerHTML
  const text = element.textContent || ''
  
  element.innerHTML = text
    .split('')
    .map((ch) =>
      ch === ' '
        ? '<span class="char" style="display:inline-block;white-space:pre"> </span>'
        : `<span class="char" style="display:inline-block">${ch}</span>`
    )
    .join('')

  const chars = element.querySelectorAll('.char')
  const revert = () => {
    element.innerHTML = originalHTML
  }

  return { chars: Array.from(chars), revert }
}

/**
 * Split element text into word spans.
 */
export function splitTextToWords(element) {
  if (!element) return { words: [], revert: () => {} }
  const originalHTML = element.innerHTML
  const text = element.textContent || ''

  element.innerHTML = text
    .split(' ')
    .map((w) => `<span class="word" style="display:inline-block;margin-right:0.25em">${w}</span>`)
    .join('')

  const words = element.querySelectorAll('.word')
  const revert = () => {
    element.innerHTML = originalHTML
  }

  return { words: Array.from(words), revert }
}
