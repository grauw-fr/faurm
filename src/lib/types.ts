import type {RemoteFormField, RemoteFormInput, RemoteFormIssue, RemoteQuery, RemoteQueryOverride} from "@sveltejs/kit";
import type {StandardSchemaV1} from "@standard-schema/spec";
import type {Snippet} from "svelte";
import type {HTMLAttributes, HTMLFieldsetAttributes} from "svelte/elements";

import type {FaurmContext} from "./use-faurm.svelte.js";

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


export type WithChild<T extends unknown[]> = {
    child?: Snippet<T>
}

export type FieldProps = {
    field: RemoteFormField<any>
    id?: string,
    children?: Snippet
}


export type FieldSetProps =
    Omit<HTMLFieldsetAttributes, 'form'>
    & FieldProps
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
    children?: Snippet,
}

export type LabelProps = HTMLAttributes<HTMLLabelElement>
    & WithChild<[{ props: HTMLAttributes<HTMLLabelElement> }]>
    & {
    children?: Snippet
}

export type DescriptionProps = HTMLAttributes<HTMLElement>
    & WithChild<[{ props: HTMLAttributes<HTMLElement> }]>
    & {
    children?: Snippet
}

export type FieldErrorsProps = HTMLAttributes<HTMLElement> & {
    children?: Snippet<[{ issues: RemoteFormIssue[] | undefined, props: HTMLAttributes<HTMLElement> }]>
}