import type {StandardSchemaV1} from "@standard-schema/spec";


export namespace Faurm {
    type FaurmData<Schema> = Partial<StandardSchemaV1.InferInput<Schema>>
    type FaurmValidationError<Schema> = {
        errors: Partial<Record<keyof StandardSchemaV1.InferInput<Schema>, string[]>>
    }
}

type MaybePromise<T> = T | Promise<T>;

type FaurmExecutor<Schema extends StandardSchemaV1, Output = any extends [p: string]: FormDataEntryValue> = (data: FormData) => FaurmResult<Schema, Output>;

type FaurmResult<Schema extends StandardSchemaV1, Output = any> =
    | { type: "failure", status: 422, errors:  Faurm.FaurmValidationError<Schema>['errors']}
    | { type: "success", status: 204 }
    | { type: "success", status: 200 | 201, data: Output };
