import type {RemoteFormInput, RemoteQuery, RemoteQueryOverride} from "@sveltejs/kit";
import type {StandardSchemaV1} from "@standard-schema/spec";
import type {FaurmContext} from "$lib/use-faurm.svelte.js";
import type {Snippet} from "svelte";


export type UseFaurmOpts<RFInput extends RemoteFormInput> = {
    initialData?: Partial<RFInput>
    validate?: StandardSchemaV1<RFInput>,
    resetForm?: boolean,

    delay?: number,
    timeout?: number

    onSubmit?: (data: RFInput) => void
    onSuccess?: () => void
    onValidationError?: () => void,
    updates?: () => Array<RemoteQuery<any> | RemoteQueryOverride>
}

export type FieldProps<TFaurmContext extends FaurmContext<any, any>> = {
    form: TFaurmContext
    name: keyof ExtractInput<TFaurmContext> & string;
    id?: string,
    children?: Snippet
}

type ExtractInput<T> = T extends FaurmContext<infer Input, any> ? Input : never;

