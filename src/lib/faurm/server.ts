import type {StandardSchemaV1} from '@standard-schema/spec';
import {type RemoteForm} from '@sveltejs/kit';
import {form} from '$app/server';
import type {FaurmExecutor, FaurmResult} from "$lib/faurm/types.js";
import {faurmValidationFailure, validateFormData} from "$lib/faurm/shared.js";


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
        let result = await validateFormData(validator, data)
        if (result?.errors) return faurmValidationFailure<Schema>(result.errors);

        return fn(data);
    });
};

