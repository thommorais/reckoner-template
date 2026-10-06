import { useEffect } from 'react'
import { useLocale } from 'react-intlayer'

const DocumentLocale = () => {
	const { locale } = useLocale()

	useEffect(() => {
		document.documentElement.lang = locale
	}, [locale])

	return null
}

export { DocumentLocale }
