import type {StandardSchemaV1} from "@standard-schema/spec";
import {getContext, setContext} from "svelte";
import type {RemoteForm} from "@sveltejs/kit";

import type {Faurm} from "./types.js";
import {faurmResponse, validateFormData} from "./shared.js";

const FORM_STATE_CONTEXT_KEY = Symbol('FAURM_STATE_CONTEXT_KEY');

type UseFaurmOpts<
    Schema extends StandardSchemaV1,
    RemoteFn extends RemoteForm<Faurm.Result<Schema, any>>
> = {
    validator: Schema,
    remoteFn: RemoteFn
    initialData?: Partial<StandardSchemaV1.InferInput<Schema>>
    timers?: {
        delay?: number,
        timeout?: number
    },
    resetForm?: boolean,
    onSubmit?: (data: StandardSchemaV1.InferInput<Schema>) => void
    onSuccess?: () => void
    onError?: () => void
}
export const useFaurm = <
    Schema extends StandardSchemaV1,
    RemoteFn extends RemoteForm<Faurm.Result<Schema, any>>>(opts: UseFaurmOpts<Schema, RemoteFn>) => {
    const context = getContext<FaurmContext<Schema, RemoteFn>>(FORM_STATE_CONTEXT_KEY);
    if (context) {
        return context;
    }
    return setContext(FORM_STATE_CONTEXT_KEY, new FaurmContext<Schema, RemoteFn>(opts))
}

class FaurmContext<
    Schema extends StandardSchemaV1,
    RemoteFn extends RemoteForm<Faurm.Result<Schema, any>>
> {
    data: StandardSchemaV1.InferOutput<Schema>
    errors: Faurm.Validator.Error<Schema>['errors']
    remoteFn: RemoteFn;
    validator: Schema;

    timersConfig: NonNullable<UseFaurmOpts<any, any>['timers']>
    timers = $state({submitting: false, delayed: false, timeout: false})
    resetForm: boolean

    onSubmit: (data: StandardSchemaV1.InferInput<Schema>) => void = () => null
    onSuccess: () => void = () => null
    onError: () => void = () => null


    constructor(opts: UseFaurmOpts<Schema, RemoteFn>) {
        this.remoteFn = opts.remoteFn
        this.validator = opts.validator

        this.data = $state(opts.initialData ?? {})
        this.errors = $state({})


        $effect.pre(() => {
            if (this.remoteFn.result?.status === 422) {
                this.handleValidationFailure(this.remoteFn.result)
            }
        })

        this.timersConfig = {
            delay: 500,
            timeout: 8000,
            ...opts.timers ?? {}
        }
        this.resetForm = !!opts.resetForm

        if (opts.onSubmit) {
            this.onSubmit = opts.onSubmit
        }
        if (opts.onError) {
            this.onError = opts.onError
        }
        if (opts.onSuccess) {
            this.onSuccess = opts.onSuccess
        }
    }

    handleValidationFailure(result: Faurm.Results.ValidationError<Schema>) {
        console.log(result);
        Object.assign(this.errors, result.errors)
        this.onError?.()
    }

    resetValidationErrors() {
        Object.assign(this.errors, {})
    }

    get enhance() {
        return this.remoteFn.enhance(async ({form, submit, data}) => {
            // todo: handle cancellation and double submits (via the timers.submitting ? )
            let timersDelayInterval;
            let timersTimeoutInterval;
            try {
                this.timers.submitting = true;
                timersDelayInterval = setInterval(() => this.timers.delayed = true, this.timersConfig.delay)
                timersTimeoutInterval = setInterval(() => this.timers.timeout = true, this.timersConfig.timeout)

                //Unset validation errors
                this.resetValidationErrors();

                //Front end data validation
                let result = await validateFormData(this.validator, data);
                if (result.errors) {
                    this.handleValidationFailure(
                        faurmResponse.validationFailure(result.errors)
                    );
                    return;
                }
                this.onSubmit?.(result.value);
                //Perform the actual form submission
                await submit();

                if (this.resetForm) {
                    form.reset();
                }

                if (this.remoteFn.result?.type === "success") {
                    this.onSuccess?.()
                }

            } finally {
                this.timers.submitting = false
                this.timers.delayed = false
                this.timers.timeout = false

                clearInterval(timersDelayInterval)
                clearInterval(timersTimeoutInterval)
            }
        })
    }
}
