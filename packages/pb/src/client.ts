export type Unsubscribe = () => Promise<void>

export type RequestOptions = Record<string, unknown>

export type ListResult<TRecord> = {
	readonly page: number
	readonly perPage: number
	readonly totalItems: number
	readonly totalPages: number
	readonly items: readonly TRecord[]
}

export type RecordEvent<TRecord> = {
	readonly action: string
	readonly record: TRecord
}

export type CollectionService<TRecord> = {
	readonly getList: (page: number, perPage: number, options?: RequestOptions) => Promise<ListResult<TRecord>>
	readonly subscribe: (
		topic: string,
		handler: (event: RecordEvent<TRecord>) => void,
		options?: RequestOptions,
	) => Promise<Unsubscribe>
}

export type Client<TRecord> = {
	readonly filter: (expr: string, params?: Record<string, unknown>) => string
	readonly collection: (name: string) => CollectionService<TRecord>
}

export type Realtime = {
	readonly subscribe: (topic: string, handler: () => void) => Promise<unknown>
}
