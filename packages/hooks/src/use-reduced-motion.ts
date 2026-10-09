import { useMediaQuery } from './use-media-query'

const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

export { useReducedMotion }
