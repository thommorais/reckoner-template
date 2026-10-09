import { isServerSide } from '@thom/utils/env'
import { useSyncExternalStore } from 'react'

type Browser = 'undetermined' | 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'ie' | 'other'

const matchers: readonly (readonly [Exclude<Browser, 'undetermined' | 'other'>, RegExp])[] = [
	['edge', /Edge\/([0-9]+)/i],
	['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9]+)/i],
	['firefox', /Firefox\/([0-9]+)/i],
	['safari', /^((?!chrome|android).)*safari/i],
	['opera', /(OPR|Opera)\/([0-9]+)/i],
	['ie', /MSIE|Trident/i],
]

const getBrowser = (): Browser => {
	if (isServerSide()) {
		return 'undetermined'
	}

	const { userAgent } = window.navigator

	return matchers.find(([, pattern]) => pattern.test(userAgent))?.[0] ?? 'other'
}

const getBrowserVersion = (): string | null => {
	if (isServerSide()) {
		return null
	}

	const match = window.navigator.userAgent.match(/(chrome|firefox|safari|opera|edge|msie|trident(?=\/))\/?\s*(\d+)/i)

	return match?.[2] || null
}

const subscribe = () => () => {}

const getServerSnapshot = (): Browser => 'undetermined'

const useBrowser = (): Browser => useSyncExternalStore(subscribe, getBrowser, getServerSnapshot)

export { useBrowser, getBrowserVersion }

export type { Browser }
