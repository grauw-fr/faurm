import type {StandardSchemaV1} from '@standard-schema/spec';
import {type RemoteForm} from '@sveltejs/kit';
import {form} from '$app/server';

type MaybePromise<T> = T | Promise<T>;

type FaurmExecutor<Schema extends StandardSchemaV1, Output> = (data: FormData) => FaurmResult<Schema, Output>;


type FaurmResult<Schema extends StandardSchemaV1, Output> =
    | { type: "failure", status: 422, errors: Partial<Record<keyof StandardSchemaV1.InferInput<Schema>, string[]>> }
    | { type: "success", status: 204 }
    | { type: "success", status: 200 | 201, data: Output };

export const faurmSuccess = {
    noContent: () => ({ type: "success" as const, status: 204 as const }),
    ok: <T>(data: T) => ({ type: "success" as const, status: 200 as const, data }),
    created: <T>(data: T) => ({ type: "success" as const, status: 201 as const, data }),
};

export const faurmValidationFailure = <Schema extends StandardSchemaV1>(
    errors: Partial<Record<keyof StandardSchemaV1.InferInput<Schema>, string[]>>
) => ({ type: "failure" as const, status: 422 as const, errors });

/**
 * Creates a remote faurm. Returns an opinionated remote form, with validation error handling
 * When valid, the form data is handled by a regular remote form call.
 * TODO: Add doc link
 * @param {StandardSchemaV1} validator A standard schema validator.
 * @param {FaurmExecutor} fn The remote form function that runs actual code. It should return a FaurmResult if you want you result to be handled by faurm
 *
 * @since 0.0.1
 */
export const faurm = <Schema extends StandardSchemaV1, Output>(
    validator: Schema,
    fn: FaurmExecutor<Schema, Output>
): RemoteForm<FaurmResult<Schema, Output>> => {
    return form<FaurmResult<Schema, Output>>(async (data) => {

        let result = validator['~standard'].validate(
            Object.fromEntries(data.entries())
        ) as MaybePromise<
            StandardSchemaV1.Result<StandardSchemaV1.InferOutput<Schema>>
        >;
        if (result instanceof Promise) result = await result;

        if (result.issues) {
            const errors: Partial<Record<keyof StandardSchemaV1.InferInput<Schema>, string[]>> = {};

            for (const issue of result.issues) {
                if (!issue.path) {
                    continue;
                }

                const path = issue.path[0] as keyof StandardSchemaV1.InferOutput<Schema>;

                if (!errors[path]) errors[path] = [];

                errors[path].push(issue.message);
            }

            return faurmValidationFailure<Schema>(errors);
        }

        return fn(data);
    });
};
