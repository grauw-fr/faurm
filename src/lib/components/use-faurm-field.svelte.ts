import {getContext, setContext} from "svelte";
import type {RemoteFormField} from "@sveltejs/kit";

type UseFaurmFieldOpts = {
    id: string
}
export const FAURM_FIELD_KEY = Symbol("FAURM_FIELD_KEY")
export const setFaurmFieldContext = (field: RemoteFormField<any>, opts: UseFaurmFieldOpts) => {
    return setContext(FAURM_FIELD_KEY, new FaurmFieldContext(field, opts));
}

export const getFaurmFieldContext = () => {
    const state = getContext<FaurmFieldContext>(FAURM_FIELD_KEY);
    if (!state) {
        throw new Error("Field not set.")
    }
    return state;
}

class FaurmFieldContext {
    field: RemoteFormField<any>;
    id: string

    hasDescription = $state(false)
    describedByDescriptionId: string

    hasErrors = $state(false)
    describedByErrorsId: string

    constructor(field: RemoteFormField<any>, opts: UseFaurmFieldOpts) {
        this.field = field
        this.id = opts.id;

        this.describedByDescriptionId = `description-${this.id}`
        this.describedByErrorsId = `errors-${this.id}`
    }
}