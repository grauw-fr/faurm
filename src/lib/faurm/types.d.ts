export namespace Faurm {
    namespace Validator {
        type Error<Schema> = {
            value?: undefined
            errors: Partial<Record<keyof StandardSchemaV1.InferInput<Schema>, string[]>>
        }

        type Success<Schema> = {
            errors?: undefined
            value: StandardSchemaV1.InferOutput<Schema>
        }
        type Result<Schema> = | Error<Schema> | Success<Schema>
    }

    namespace Remote {
        type Executor<Schema extends StandardSchemaV1, Output> = (data: FormData) => MaybePromise<Faurm.Result<Schema, Output>>;
    }

    namespace Results {
        type ValidationError<Schema> = {
            type: "failure",
            status: 422,
            errors: Faurm.Validator.Error<Schema>['errors']
        }

        type NoContent = { type: "success", status: 204 }
        type Created<Output> = { type: "success", status: 201, data: Output }
        type Ok<Output> = { type: "success", status: 200, data: Output }
    }

    type Result<Schema, Output> = | Faurm.Results.ValidationError<Schema> | Faurm.Results.NoContent | Faurm.Results.Created<Output> | Faurm.Results.Ok<Output> | void

    namespace Helpers {
        type MaybePromise<T> = T | Promise<T>;
    }
}
