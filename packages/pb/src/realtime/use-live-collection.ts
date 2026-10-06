import { tryCatch } from '@thom/try-catch'
import { useCallback, useEffect, useEffectEvent, useReducer, useState } from 'react'
import type { Client, RecordEvent, RequestOptions } from '../client'
import type { Filter } from '../filter-builder'
import type { Connection } from './connection'
import {
	type Action,
	type Entity,
	initial,
	type ListOutcome,
	type LiveCollectionState,
	type Model,
	reduce,
	toView,
} from './live-collection-model'
import { useSubscription } from './use-subscription'

export type LiveSource<TRecord, TEntity extends Entity> = {
	readonly client: Client<TRecord>
	readonly collection: string
	readonly map: (record: TRecord) => TEntity
	readonly connection: Connection
}

export type LiveCollectionOptions = {
	readonly filter?: Filter
	readonly sort?: string
	readonly perPage?: number
	readonly skip?: boolean
}

export type LiveCollection<TEntity> = {
	readonly state: LiveCollectionState<TEntity>
	readonly page: number
	readonly perPage: number
	readonly setPage: (page: number) => void
}

const DEFAULT_PER_PAGE = 30

const FIRST_PAGE = 1

const listOptions = (query: string, sort: string | undefined): RequestOptions => ({
	...(query && { filter: query }),
	...(sort && { sort }),
	requestKey: null,
})

const subscribeOptions = (query: string): RequestOptions | undefined => (query ? { filter: query } : undefined)

export const useLiveCollection = <TRecord, TEntity extends Entity>(
	{ client, collection, map, connection }: LiveSource<TRecord, TEntity>,
	{ filter, sort, perPage = DEFAULT_PER_PAGE, skip = false }: LiveCollectionOptions = {},
): LiveCollection<TEntity> => {
	const query = filter ? client.filter(filter.expr, filter.params) : ''
	const scope = JSON.stringify([collection, query, sort, perPage])

	const [paging, setPaging] = useState({ scope, page: FIRST_PAGE })
	const page = paging.scope === scope ? paging.page : FIRST_PAGE
	const setPage = useCallback((next: number) => setPaging({ scope, page: next }), [scope])

	const [model, dispatch] = useReducer<Model<TEntity>, boolean, [Action<TEntity>]>(reduce, skip, initial)

	const onLoaded = useEffectEvent((token: symbol, result: ListOutcome<TRecord>) =>
		dispatch({ type: 'loaded', token, view: toView(result, map) }),
	)

	const onEvent = useEffectEvent(({ action, record }: RecordEvent<TRecord>) =>
		dispatch({ type: 'changed', action, entity: map(record) }),
	)

	useEffect(() => {
		if (skip) {
			dispatch({ type: 'skipped' })
			return
		}

		const token = Symbol(scope)

		dispatch({ type: 'requested', key: JSON.stringify([scope, page]), token })

		void tryCatch(client.collection(collection).getList(page, perPage, listOptions(query, sort))).then(result =>
			onLoaded(token, result),
		)
	}, [client, collection, query, sort, page, perPage, scope, skip, model.run])

	useSubscription(
		() =>
			skip
				? undefined
				: client
						.collection(collection)
						.subscribe('*', event => onEvent(event), subscribeOptions(query))
						.then(unsubscribe => {
							dispatch({ type: 'invalidated' })
							return unsubscribe
						}),
		[client, collection, query, skip],
	)

	useEffect(() => connection.onReconnect(() => dispatch({ type: 'invalidated' })), [connection])

	return { state: model.view, page, perPage, setPage }
}
