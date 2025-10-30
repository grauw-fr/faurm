import type {RemoteFormInput, RemoteFormIssue, RemoteQuery, RemoteQueryOverride} from "@sveltejs/kit";
import type {StandardSchemaV1} from "@standard-schema/spec";
import type {FaurmContext} from "$lib/use-faurm.svelte.js";
import type {Snippet} from "svelte";
import type {HTMLAttributes, HTMLFieldsetAttributes} from "svelte/elements";


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

type ExtractInput<T> = T extends FaurmContext<infer Input, any> ? Input : never;

export type WithChild<T extends unknown[]> = {
    child: Snippet<T>
}

export type FieldProps<TFaurmContext extends FaurmContext<any, any>> = {
    form: TFaurmContext
    name: keyof ExtractInput<TFaurmContext> & string;
    id?: string,
    children?: Snippet
}


export type FieldSetProps<TFaurmContext extends FaurmContext<any, any>> =
    Omit<HTMLFieldsetAttributes, 'form'>
    & FieldProps<TFaurmContext>
    & WithChild<[{ props: HTMLFieldsetAttributes }]>
    & {
    children: Snippet,
}

export type FieldControlProps<TField> = {
    children: Snippet<[{ props: any, field: TField }]>
}

export type LegendProps =
    HTMLAttributes<HTMLLegendElement>
    & WithChild<[{ props: HTMLAttributes<HTMLLegendElement> }]>
    & {
    children: Snippet,
}

export type LabelProps = HTMLAttributes<HTMLLabelElement> & {
    child?: Snippet<[{ props: HTMLAttributes<HTMLLabelElement> }]>
    children?: Snippet
}

export type DescriptionProps = HTMLAttributes<HTMLElement> & {
    child?: Snippet<[{ props: HTMLAttributes<HTMLElement> }]>
    children?: Snippet
}

export type FieldErrorsProps = HTMLAttributes<HTMLElement> & {
    children?: Snippet<[{ issues: RemoteFormIssue[] | undefined, props: HTMLAttributes<HTMLElement> }]>
}