import type {StandardSchemaV1} from "@standard-schema/spec";
import type {Faurm} from "$lib/faurm/types.js";


export const validateFormData =
    async <Schema extends StandardSchemaV1>(validator: Schema, data: FormData): Promise<
        Faurm.Validator.Result<Schema>
    > => {
        //TODO: This whole function could be extracted, and only the formData parsed to an object
        let result = validator['~standard'].validate(
            Object.fromEntries(data.entries())
        ) as Faurm.Helpers.MaybePromise<
            StandardSchemaV1.Result<StandardSchemaV1.InferOutput<Schema>>
        >;
        if (result instanceof Promise) result = await result;

        if (result.issues === undefined) {
            return {value: result.value} as Faurm.Validator.Success<Schema>;
        }

        //TODO: This whole transformation could be extracted when we validated more data types
        const errors: Partial<Record<keyof StandardSchemaV1.InferInput<Schema>, string[]>> = {};

        for (const issue of result.issues) {
            if (!issue.path) {
                continue;
            }

            const path = issue.path[0] as keyof StandardSchemaV1.InferOutput<Schema>;

            if (!errors[path]) errors[path] = [];

            errors[path].push(issue.message);
        }

        return {errors} as Faurm.Validator.Error<Schema>;
    }

export const faurmSuccess = {
    noContent: (): Faurm.Results.NoContent => ({type: "success", status: 204}),
    ok: <T>(data: T): Faurm.Results.Ok<T> => ({type: "success", status: 200, data}),
    created: <T>(data: T): Faurm.Results.Created<T> => ({type: "success", status: 201, data}),
};

export const faurmValidationFailure = <Schema extends StandardSchemaV1>(
    errors: Partial<Record<keyof StandardSchemaV1.InferInput<Schema>, string[]>>
): Faurm.Results.ValidationError<Schema> => ({type: "failure", status: 422, errors});
