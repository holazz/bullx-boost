function extractContractAddress(url: string) {
  try {
    const match = url.match(/\/([^\/]+)$/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

function createGmgnlink(href: string) {
  const parser = new DOMParser()
  const template = `
  <a class="gmgn-link text-grey-400 hover:text-grey-300" href="${href}" target="_blank">
  <button
    type="button"
    class="ant-btn ant-btn-default !rounded-full !border-none w-5 h-5 text-center !p-0 !m-0 !bg-grey-500"
  >
    <img src="${chrome.runtime.getURL('src/assets/gmgn.png')}" alt="gmgn" />
  </button>
  </a>`
  const doc = parser.parseFromString(template, 'text/html')
  return doc.body.firstChild!
}

function handlePumpCard(card: HTMLElement) {
  if (card.querySelector('.gmgn-link') !== null) return

  const pumpfunLink = card.querySelector('.flex.flex-col.ml-3 .mt-2 a.text-grey-400')
  if (pumpfunLink) {
    const originalHref = pumpfunLink.getAttribute('href')
    if (originalHref) {
      const gmgnLink = `https://gmgn.ai/sol/token/${extractContractAddress(pumpfunLink.getAttribute('href')!)}`
      const a = createGmgnlink(gmgnLink)
      pumpfunLink.parentNode!.insertBefore(a, pumpfunLink)
    }
  }
}

export function render() {
  const pumpCardWrapper = document.querySelector('main div.grid.min-h-screen')!

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if ((node as HTMLElement).classList.contains('pump-card')) {
              handlePumpCard(node as HTMLElement)
            }
            const pumpCards = (node as HTMLElement).querySelectorAll('.pump-card') as unknown as HTMLElement[]
            pumpCards.forEach(handlePumpCard)
          }
        })
      }
    })
  })

  observer.observe(pumpCardWrapper, {
    childList: true,
    subtree: true,
  })
}

render()
