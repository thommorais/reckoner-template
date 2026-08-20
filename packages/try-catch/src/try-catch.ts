/**
 * @deprecated Import from `@thom/safe-return` instead. This module re-exports
 * the unified `Safe` result so existing import paths keep resolving.
 *
 * The result shape changed: the discriminant is now `success` rather than
 * `isSuccess`, and a failure no longer carries a `data: null` field.
 */
export { errorToResponse as failure, tryCatch, tryCatchSync, type ErrorResponse } from '@thom/safe-return/http'

export {
	flatMap,
	map,
	ok as success,
	type Safe as Result,
	type SafeData as Success,
	type SafeError as Failure,
} from '@thom/safe-return'
