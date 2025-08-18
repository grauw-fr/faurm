import type {StandardSchemaV1} from "@standard-schema/spec";
import {getContext, setContext} from "svelte";
import type {RemoteForm} from "@sveltejs/kit";
import type {FaurmResult} from "$lib/faurm/types.js";


const FORM_STATE_CONTEXT_KEY = Symbol('FAURM_STATE_CONTEXT_KEY');

type UseFormData<Schema extends StandardSchemaV1> = StandardSchemaV1.InferInput<Schema>
type UseFormOpts<Schema extends StandardSchemaV1> = {
    validator: Schema,
    reset: boolean;
    onSubmit: () => void;
    onError: () => void;
    onSuccess: () => void;
    remoteFaurm: any
}

export const useFaurm = <Schema extends StandardSchemaV1>(data: StandardSchemaV1.InferInput<Schema>, opts: {
    validator: Schema
}) => {
    const context = getContext<FaurmContext<Schema>>(FORM_STATE_CONTEXT_KEY);
    if (context) {
        return context;
    }
    return setContext(FORM_STATE_CONTEXT_KEY, new FaurmContext<Schema>(data, opts))
}

type FormContextOpts<Schema extends StandardSchemaV1> = {
    data: StandardSchemaV1.InferOutput<Schema>
    opts:
}

class FaurmContext<Schema extends StandardSchemaV1> {
    data: StandardSchemaV1.InferOutput<Schema>

    constructor(opts: FormContextOpts<any>) {
        this.data = $state(opts.data)
        this.errors
        this.initErrors;

    }
}
