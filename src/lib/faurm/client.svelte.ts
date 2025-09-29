import {getContext, setContext} from "svelte";
import type {RemoteForm, RemoteFormInput, RemoteFormIssue} from "@sveltejs/kit";
import type {StandardSchemaV1} from "@standard-schema/spec";

const FORM_STATE_CONTEXT_KEY = Symbol('FAURM_STATE_CONTEXT_KEY');

type UseFaurmOpts<RFInput extends RemoteFormInput, RFOutput> = {
    initialData?: Partial<RFInput>
    validate?: StandardSchemaV1<RFInput>,
    resetForm?: boolean,

    delay?: number,
    timeout?: number

    onSubmit?: (data: RFInput) => void
    onSuccess?: () => void
    onValidationError?: () => void
}

export const useFaurm = <RFInput extends RemoteFormInput, RFOutput>(
    form: RemoteForm<RFInput, RFOutput>,
    opts: UseFaurmOpts<RFInput, RFOutput>
) => {
    const context = getContext<FaurmContext<RFInput, RFOutput>>(FORM_STATE_CONTEXT_KEY);
    if (context) {
        return context;
    }
    return setContext(
        FORM_STATE_CONTEXT_KEY,
        new FaurmContext<RFInput, RFOutput>(form, opts)
    );
}

class FaurmContext<RFInput extends RemoteFormInput, RFOutput> {
    private readonly remoteForm: RemoteForm<RFInput, RFOutput>;
    private readonly validate: StandardSchemaV1<RFInput> | undefined;
    data: Partial<RFInput>;

    private readonly resetForm: boolean;

    private readonly timersConfig: {
        delay: number,
        timeout: number
    }
    issues: RemoteForm<RFInput, RFOutput>['issues']
    result: RemoteForm<RFInput, RFOutput>['result']
    timers = $state({submitting: false, delayed: false, timeout: false})

    onSubmit: (data: RFInput) => void
    onSuccess: () => void
    onValidationError: () => void

    constructor(
        form: RemoteForm<RFInput, RFOutput>,
        {
            initialData = {},
            validate,
            delay = 500,
            timeout = 8000,
            resetForm = true,
            onSubmit = () => null,
            onSuccess = () => null,
            onValidationError = () => null
        }: UseFaurmOpts<RFInput, RFOutput>
    ) {
        this.remoteForm = form;
        this.validate = validate

        this.timersConfig = {
            delay,
            timeout
        }
        this.resetForm = !!resetForm

        this.data = $state({
            ...(this.remoteForm.input ?? {}),
            ...initialData
        });

        $effect(() => {
            // @ts-ignore TODO: Figure this out
            if (this.remoteForm.issues) {
                this.onValidationError();
            }
        })

        this.issues = $derived(this.remoteForm.issues)
        this.result = $derived(this.remoteForm.result)

        this.onSubmit = onSubmit
        this.onValidationError = onSuccess
        this.onSuccess = onValidationError



    }


    get enhance() {
        if (this.validate) {
            return this.remoteForm.preflight(this.validate).enhance(this.enhancer);
        }
        return this.remoteForm.enhance(this.enhancer);
    }

    private enhancer: Parameters<RemoteForm<RFInput, RFOutput>["enhance"]>[0] = async ({form, data, submit}) => {
        let timersDelayInterval;
        let timersTimeoutInterval;
        try {
            this.timers.submitting = true;
            timersDelayInterval = setInterval(() => this.timers.delayed = true, this.timersConfig.delay)
            timersTimeoutInterval = setInterval(() => this.timers.timeout = true, this.timersConfig.timeout)

            this.onSubmit(data);

            await submit();

            if (this.resetForm) {
                form.reset();
            }

            this.onSuccess()

        } finally {
            this.timers.submitting = false
            this.timers.delayed = false
            this.timers.timeout = false

            clearInterval(timersDelayInterval)
            clearInterval(timersTimeoutInterval)
        }
    }
}

/**
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

 if(this.remoteFn?.result?.status === 422){
 this.handleValidationFailure(this.remoteFn.result)
 }

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
 */