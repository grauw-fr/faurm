import type {RemoteForm, RemoteFormInput, RemoteQuery, RemoteQueryOverride} from "@sveltejs/kit";
import type {StandardSchemaV1} from "@standard-schema/spec";
import type {UseFaurmOpts} from "./types.js";
import {tick} from "svelte";

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


    private flagsState: { pristine: boolean; dirty: boolean; } = $state({dirty: false, pristine: true});
    private snapshotState: Partial<RFInput> = $state({});

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
        this.validate = validate

        this.remoteForm.fields.set(initialData)
        this.snapshot.set($state.snapshot(this.remoteForm.fields.value()));

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

        $effect(() => {
            const hasBeenModified = JSON.stringify(this.fields.value()) !== JSON.stringify(this.snapshot.value());
            this.flags.set({
                pristine: !hasBeenModified,
                dirty: hasBeenModified,
            })
        })
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

            if (this.remoteForm.fields.issues()?.length === undefined) {
                if (this.resetForm) {
                    form.reset();
                    await tick();
                    this.snapshot.set($state.snapshot(this.remoteForm.fields.value()))
                }

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

    get results(): RFOutput | undefined {
        return this.remoteForm.result
    }

    get flags() {
        return {
            value: () => {
                return this.flagsState
            },
            set: (flags: typeof this.flagsState) => {
                this.flagsState = flags
            },
        }
    }

    get snapshot() {
        return {
            value: () => {
                return this.snapshotState
            },
            set: (snapshot: typeof this.snapshotState) => {
                this.snapshotState = snapshot
            },
        }
    }
}