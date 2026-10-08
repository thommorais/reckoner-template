const CONST = {
	PRODUCTION: 'production',
	SERVER: 'server',
	CLIENT: 'client',
	UNKNOWN: 'unknown',
} as const

const LOCAL_HREFS = {
	HOME: '/',
}

export { CONST, LOCAL_HREFS }
export { ASSETS } from '_/constants/assets-paths'
export { ENVS } from '_/constants/envs'
export { MEDIA_QUERIES } from '_/constants/media-queries'
export { VIEW } from '_/constants/view'
