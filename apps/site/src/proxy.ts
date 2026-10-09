import { I18nMiddleware } from '_/i18n/i18n-middleware'
import type { NextRequest } from 'next/server'

const proxy = async (request: NextRequest) => {
	return I18nMiddleware(request)
}

export { proxy }

export const config = {
	matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)'],
}
