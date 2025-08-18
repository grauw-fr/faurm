<script lang="ts">
    import {login} from "./faurm.remote.js";
    import {loginFormSchema} from "./schemas.js";
    import type {StandardSchemaV1} from "@standard-schema/spec";
    import type {RemoteForm} from "@sveltejs/kit";
    import type {Faurm, FaurmResult} from "$lib/faurm/types.d.ts";
    import {validateFormData} from "$lib/faurm/shared.js";

    type UseFaurmOpts<Schema extends StandardSchemaV1> = {
        validator: Schema,
        initialData: Partial<StandardSchemaV1.InferInput<Schema>>
        remoteFn: RemoteForm<FaurmResult<Schema>>
    }

    const useFaurm = <Schema extends StandardSchemaV1>(opts: UseFaurmOpts<Schema>) => new FaurmContext(opts)

    class FaurmContext<Schema extends StandardSchemaV1> {
        private validator: Schema;
        #data: Faurm.FaurmData<Schema>
        #errors: Faurm.FaurmValidationError<Schema>['errors'] = $state({})
        private remoteFn: RemoteForm<FaurmResult<Schema>>;
        constructor(opts: UseFaurmOpts<Schema>) {
            this.validator = opts.validator;
            this.#data = $state(opts.initialData ?? {})
            this.remoteFn = opts.remoteFn

        }
        private initErrors() {
            if (this.remoteFn.result?.status === 422) {
                this.#errors = this.remoteFn.result.errors;
            }
        }

        private resetErrors() {
            this.#errors = {}
        }
        handleValidationFailure(errors: Faurm.FaurmValidationError<Schema>['errors']){
            this.#errors = errors;
        }

        get enhance() {
            return this.remoteFn.enhance(async ({form, submit, data}) => {
                let frontEndValidationResult = await validateFormData(this.validator, data)
                if (frontEndValidationResult?.errors) {
                    this.handleValidationFailure(frontEndValidationResult?.errors);
                    return
                }
            })
        }
        get data() {
            return this.#data
        }
        get errors() {
            return this.#errors
        }
    }

    const form = useFaurm({
        validator: loginFormSchema,
        initialData: {
            email: 'alexandre',
        },
        remoteFn: login
    })

    // const {data, errors, enhance} = form
    $inspect(form.data, form.errors)

</script>
<form {...form.enhance}>
    <fieldset>
        <label>
            Email
            <input
                    name="email"
                    placeholder="Email"
                    aria-invalid={!!form.errors['email'] || null}
                    aria-describedby={form.errors['email'] ? 'invalid-email-helper' : null}
                    bind:value={form.data.email}
            />
            {#if form.errors['email']}
                <small id="invalid-email-helper">
                    {form.errors['email'].join(', ')}
                </small>
            {/if}
        </label>
        <label>
            Password
            <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    autocomplete="current-password"
                    aria-invalid={!!form.errors['password'] || null}
                    aria-describedby={form.errors['password'] ? 'invalid-password-helper' : null}
                    bind:value={form.data.password}
            />
            {#if form.errors['password']}
                <small id="invalid-email-helper">
                    {form.errors['password'].join(', ')}
                </small>
            {/if}
        </label>

    </fieldset>
    <input type="submit" value="Sign In"/>
</form>