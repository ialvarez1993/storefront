// composables/useHeader.ts
export const useHeader = () => {
  const isCompact = useState('header:compact', () => false)
  const isMenuOpen = useState('header:menuOpen', () => false)

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
  }

  return {
    isCompact,
    isMenuOpen,
    toggleMenu
  }
}
