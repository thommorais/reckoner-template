import { isServerSide } from '@thom/utils/env'
import { useSyncExternalStore } from 'react'

type Browser = 'undetermined' | 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'ie' | 'other'

type Matcher = {
	browser: Exclude<Browser, 'undetermined' | 'other'>
	detect: RegExp
	version: RegExp
}

const matchers: readonly Matcher[] = [
	{ browser: 'edge', detect: /Edge\/([0-9]+)/i, version: /Edge\/([0-9]+)/i },
	{ browser: 'chrome', detect: /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9]+)/i, version: /Chrom(?:e|ium)\/([0-9]+)/i },
	{ browser: 'firefox', detect: /Firefox\/([0-9]+)/i, version: /Firefox\/([0-9]+)/i },
	{ browser: 'safari', detect: /^((?!chrome|android).)*safari/i, version: /Version\/([0-9]+)/i },
	{ browser: 'opera', detect: /(OPR|Opera)\/([0-9]+)/i, version: /(?:OPR|Opera)\/([0-9]+)/i },
	{ browser: 'ie', detect: /MSIE|Trident/i, version: /(?:MSIE |rv:)([0-9]+)/i },
]

const detectBrowser = (userAgent: string) => matchers.find(({ detect }) => detect.test(userAgent))

const getBrowser = (): Browser => {
	if (isServerSide()) {
		return 'undetermined'
	}

	return detectBrowser(window.navigator.userAgent)?.browser ?? 'other'
}

const getBrowserVersion = (): string | null => {
	if (isServerSide()) {
		return null
	}

	const { userAgent } = window.navigator
	const matcher = detectBrowser(userAgent)

	return matcher ? (userAgent.match(matcher.version)?.[1] ?? null) : null
}

const subscribe = () => () => {}

const getServerSnapshot = (): Browser => 'undetermined'

const useBrowser = (): Browser => useSyncExternalStore(subscribe, getBrowser, getServerSnapshot)

export { useBrowser, getBrowserVersion }

export type { Browser }
