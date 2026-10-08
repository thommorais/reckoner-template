import { createI18nMiddleware } from 'next-international/middleware'
import { defaultLocale, locales } from './dictionaries/locales'

const I18nMiddleware: ReturnType<typeof createI18nMiddleware> = createI18nMiddleware({
	locales,
	defaultLocale,
	urlMappingStrategy: 'rewriteDefault',
})

export { I18nMiddleware }
