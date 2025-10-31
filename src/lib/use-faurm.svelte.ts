import type {RemoteForm, RemoteFormInput, RemoteQuery, RemoteQueryOverride} from "@sveltejs/kit";
import type {StandardSchemaV1} from "@standard-schema/spec";
import type {UseFaurmOpts} from "./types.js";

export const useFaurm = <RFInput extends RemoteFormInput, RFOutput>(
    form: RemoteForm<RFInput, RFOutput> | Omit<RemoteForm<RFInput, RFOutput>, 'for'>,
    opts: UseFaurmOpts<RFInput> = {}
) => {
    return new FaurmContext<RFInput, RFOutput>(form, opts);
}

export class FaurmContext<RFInput extends RemoteFormInput, RFOutput> {
    private readonly remoteForm: RemoteForm<RFInput, RFOutput> | Omit<RemoteForm<RFInput, RFOutput>, 'for'>;
    private readonly validate: StandardSchemaV1<RFInput> | undefined;

    private readonly resetForm: boolean;

    private readonly timersConfig: {
        delay: number,
        timeout: number
    }

    timers = $state({submitting: false, delayed: false, timeout: false})

    onSubmit: (data: RFInput) => void
    onSuccess: () => void
    onValidationError: () => void

    private readonly updates: () => Array<RemoteQuery<any> | RemoteQueryOverride>

    constructor(
        form: RemoteForm<RFInput, RFOutput> | Omit<RemoteForm<RFInput, RFOutput>, 'for'>,
        {
            initialData = {},
            validate,
            delay = 500,
            timeout = 8000,
            resetForm = true,
            onSubmit = () => null,
            onSuccess = () => null,
            onValidationError = () => null,
            updates = () => []
        }: UseFaurmOpts<RFInput>
    ) {
        this.remoteForm = form;

        this.remoteForm.fields.set(initialData)

        this.validate = validate

        this.timersConfig = {
            delay,
            timeout
        }
        this.resetForm = !!resetForm

        $effect(() => {
            if (this.remoteForm.fields.issues() !== undefined) {
                this.onValidationError();
            }
        })


        this.onSubmit = onSubmit
        this.onValidationError = onValidationError
        this.onSuccess = onSuccess

        this.updates = updates
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

            await submit().updates(...this.updates());

            if (this.resetForm) {
                form.reset();
            }


            if (this.remoteForm.fields.issues()?.length === undefined){
                this.onSuccess()
            }
        } finally {
            this.timers.submitting = false
            this.timers.delayed = false
            this.timers.timeout = false

            clearInterval(timersDelayInterval)
            clearInterval(timersTimeoutInterval)
        }
    }

    get fields() {
        return this.remoteForm.fields
    }

    get results() {
        return this.remoteForm.result
    }
}