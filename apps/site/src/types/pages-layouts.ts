type LocaleType = {
	locale: string
}

type Param = string | string[] | undefined
type Params = Record<string, Param> & LocaleType

type SearchParams = {
	[param: string]: Param
}

type PageProps = {
	params: Promise<Params>
	searchParams: Promise<SearchParams>
}

type LayoutProps = { params: Promise<Params>; children: React.ReactNode }

export type { Param, Params, SearchParams, PageProps, LayoutProps }
