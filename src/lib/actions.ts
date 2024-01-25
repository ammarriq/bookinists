export const clickOutside = (node: HTMLElement, handler: () => void) => {
  const handleClick = (e: Event) => {
    if (!node.contains(e.target as HTMLElement)) handler()
  }

  window.addEventListener('click', handleClick)

  return {
    destroy: () => window.removeEventListener('click', handleClick),
  }
}

export const clickParent = (node: HTMLElement, handler: () => void) => {
  const handleClick = (e: Event) => {
    const target = e.target as HTMLElement
    const isParentClicked = node.parentElement?.isSameNode(target)

    if (!node.contains(target) && isParentClicked) handler()
  }

  window.addEventListener('click', handleClick)

  return {
    destroy: () => window.removeEventListener('click', handleClick),
  }
}
