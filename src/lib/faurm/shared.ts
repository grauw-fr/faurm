import type {StandardSchemaV1} from "@standard-schema/spec";
import type {Faurm, MaybePromise} from "$lib/faurm/types.js";



export const validateFormData =
    async <Schema extends StandardSchemaV1>(validator: Schema, data: FormData): Promise<undefined | {
        errors: Faurm.FaurmValidationError<Schema>['errors']
    }> => {
        //TODO: This whole function could be extracted, and only the formData parsed to an object
        let result = validator['~standard'].validate(
            Object.fromEntries(data.entries())
        ) as MaybePromise<
            StandardSchemaV1.Result<StandardSchemaV1.InferOutput<Schema>>
        >;
        if (result instanceof Promise) result = await result;

        if (!result.issues) {
            return
        }

        if (result.issues) {
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

            return {errors}
        }


    }

export const faurmSuccess = {
    noContent: () => ({type: "success" as const, status: 204 as const}),
    ok: <T>(data: T) => ({type: "success" as const, status: 200 as const, data}),
    created: <T>(data: T) => ({type: "success" as const, status: 201 as const, data}),
};

export const faurmValidationFailure = <Schema extends StandardSchemaV1>(
    errors: Partial<Record<keyof StandardSchemaV1.InferInput<Schema>, string[]>>
) => ({type: "failure" as const, status: 422 as const, errors});
