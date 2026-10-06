import { type Dictionary, t } from 'intlayer'

const reloadPromptContent = {
	key: 'reload-prompt',
	content: {
		message: t({ en: 'A new version is ready.', pt: 'Uma nova versão está pronta.' }),
		action: t({ en: 'Reload', pt: 'Recarregar' }),
	},
} satisfies Dictionary

// oxlint-disable-next-line import/no-default-export -- intlayer content
export default reloadPromptContent
