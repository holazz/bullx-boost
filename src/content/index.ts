function extractContractAddress(url: string) {
  try {
    const match = url.match(/\/([^\/]+)$/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

function createGmgnLink(href: string) {
  const parser = new DOMParser()
  const template = `<a class="gmgn-link text-grey-400 hover:text-grey-300" href="${href}" target="_blank">
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

function createSearchLink(href: string) {
  const parser = new DOMParser()
  const template = `<a class="gmgn-link text-grey-400 hover:text-grey-300" href="${href}" target="_blank">
  <button
    type="button"
    class="ant-btn ant-btn-default !rounded-full !border-none w-5 h-5 text-center !p-0 !m-0 !bg-grey-500"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12px"
      height="12px"
      fill="#5C6068"
      data-sentry-element="IconXsearch12px"
      data-sentry-source-file="BaseLinkView.tsx"
      viewBox="0 0 12 12"
    >
      <g clip-path="url(#clip0_9095_133)">
        <path
          d="M5.406 0a5.355 5.355 0 015.351 5.425c-.026 2.942-2.46 5.334-5.402 5.312A5.385 5.385 0 010 5.299C.031 2.349 2.44-.011 5.406 0zm-.043 9.457a4.105 4.105 0 004.13-4.059c.03-2.269-1.848-4.151-4.133-4.143a4.112 4.112 0 00-4.087 4.107 4.091 4.091 0 004.09 4.095z"
        ></path>
        <path
          d="M10.843 11.676l-.93-.93a.562.562 0 010-.792l.041-.04a.562.562 0 01.792 0l.93.93a.562.562 0 010 .792l-.04.04a.562.562 0 01-.793 0z"
        ></path>
      </g>
      <defs>
        <clipPath id="clip0_9095_133"><rect width="12" height="12"></rect></clipPath>
      </defs>
    </svg>
  </button>
</a>`
  const doc = parser.parseFromString(template, 'text/html')
  return doc.body.firstChild!
}

function handlePumpCard(card: HTMLElement) {
  if (card.querySelector('.gmgn-link') !== null) return

  const pumpfunLink = card.querySelector('.flex.flex-col.ml-3 .mt-2 a.text-grey-400')
  if (pumpfunLink) {
    const pumpfunHref = pumpfunLink.getAttribute('href')
    if (pumpfunHref) {
      const contractAddress = extractContractAddress(pumpfunLink.getAttribute('href')!)
      const gmgnHref = `https://gmgn.ai/sol/token/${contractAddress}`
      const gmgnLink = createGmgnLink(gmgnHref)
      const searchHref = `https://x.com/search?q=${contractAddress}`
      const searchLink = createSearchLink(searchHref)

      pumpfunLink.parentNode!.insertBefore(gmgnLink, pumpfunLink)
      pumpfunLink.parentNode!.insertBefore(searchLink, pumpfunLink.nextSibling)
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
