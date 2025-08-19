import type {StandardSchemaV1} from "@standard-schema/spec";
import {getContext, setContext} from "svelte";
import type {RemoteForm} from "@sveltejs/kit";
import type {Faurm, FaurmResult} from "$lib/faurm/types.js";
import {validateFormData} from "$lib/faurm/shared.js";

const FORM_STATE_CONTEXT_KEY = Symbol('FAURM_STATE_CONTEXT_KEY');

type UseFaurmOpts<Schema extends StandardSchemaV1> = {
    validator: Schema,
    remoteFn: RemoteForm<FaurmResult<Schema>>
    initialData?: Partial<StandardSchemaV1.InferInput<Schema>>
}
export const useFaurm = <Schema extends StandardSchemaV1>(opts: UseFaurmOpts<Schema>) => {
    const context = getContext<FaurmContext<Schema>>(FORM_STATE_CONTEXT_KEY);
    if (context) {
        return context;
    }
    return setContext(FORM_STATE_CONTEXT_KEY, new FaurmContext<Schema>(opts))
}

class FaurmContext<Schema extends StandardSchemaV1> {
    data: StandardSchemaV1.InferOutput<Schema>
    errors: Faurm.FaurmValidationError<Schema>['errors']
    remoteFn: RemoteForm<FaurmResult<Schema>>;
    validator: Schema;

    constructor(opts: UseFaurmOpts<Schema>) {
        this.remoteFn = opts.remoteFn
        this.validator = opts.validator

        this.data = $state(opts.initialData ?? {})
        this.errors = $state({})

        if (this.remoteFn.result?.status === 422) {
            this.handleValidationFailure(this.remoteFn.result.errors)
        }
    }

    handleValidationFailure(errors: Faurm.FaurmValidationError<Schema>['errors']) {
        Object.assign(this.errors, errors)
    }

    resetValidationErrors(){
        Object.assign(this.errors, {})
    }

    get enhance() {
        return this.remoteFn.enhance(async ({form, submit, data}) => {
            //Unset validation errors
            this.resetValidationErrors();

            //Front end data validation
            let result = await validateFormData(this.validator, data);
            if (result?.errors) {
                this.handleValidationFailure(result.errors);
                return;
            }

            //Perform the actual form submission
            await submit();

            //Perform form reset if needed

            //Perform the timers
        })
    }
}
