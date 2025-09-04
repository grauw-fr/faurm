import {type RemoteForm} from '@sveltejs/kit';
import {form} from '$app/server';
import type {StandardSchemaV1} from '@standard-schema/spec';

import type {Faurm} from "./types.d.ts";
import {faurmResponse, validateFormData} from "./shared.js";


/**
 * Creates a remote faurm. Returns a remote form, with validation error handling
 * When valid, the form data is handled by a regular remote form call.
 * TODO: Add doc link
 * @param {StandardSchemaV1} validator A standard schema validator.
 * @param {Faurm.Remote.Executor} fn The remote form function that runs actual code. It should return a FaurmResult if you want you result to be handled by faurm
 *
 * @since 0.0.1
 */
export const faurm = <Schema extends StandardSchemaV1, Output>(
    validator: Schema,
    fn: Faurm.Remote.Executor<Schema, Output>
): RemoteForm<Faurm.Result<Schema, Output>> => {
    return form<Faurm.Result<Schema, Output>>(async (data) => {
        let result = await validateFormData(validator, data)
        if (result?.errors) return faurmResponse.validationFailure<Schema>(result.errors);

        return fn(data);
    });
};

