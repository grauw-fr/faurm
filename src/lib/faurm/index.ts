import type { StandardSchemaV1 } from '@standard-schema/spec';
import { type RemoteForm } from '@sveltejs/kit';
import { form } from '$app/server';

type MaybePromise<T> = T | Promise<T>;

type FaurmExecutor<Output> = (data: FormData) => Output;
type FaurmResult<Schema extends StandardSchemaV1, Output> = {
	success: boolean;
	status: number;
	errors?: Partial<Record<keyof StandardSchemaV1.InferInput<Schema>, string[]>>;
};

/**
 * Creates a remote faurm. Returns an opinionated remote form, with validation error handling
 * When valid, the form data is handled by a regular remote form call.
 * TODO: Add doc link
 *
 * @since 0.0.1
 */
export const faurm = <Schema extends StandardSchemaV1, Output>(
	validator: Schema,
	fn: FaurmExecutor<FaurmResult<Schema, Output>>
): RemoteForm<FaurmResult<Schema, Output>> => {
	return form<FaurmResult<Schema, Output>>(async (data) => {

		let result = validator['~standard'].validate(
			Object.fromEntries(data.entries())
		) as MaybePromise<
			StandardSchemaV1.Result<StandardSchemaV1.InferOutput<Schema>>
		>;
		if (result instanceof Promise) result = await result;

		if (result.issues) {
			const errors: FaurmResult<Schema, Output>['errors'] = {};

			for (const issue of result.issues) {
				if (!issue.path) {
					continue;
				}

				const path = issue.path[0] as keyof StandardSchemaV1.InferOutput<Schema>;

				if (!errors[path]) errors[path] = [];

				errors[path].push(issue.message);
			}

			return {
				success: false,
				status: 422,
				errors
			};
		}

		return fn(data);
	});
};
