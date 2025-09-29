import z from "zod/v4";

export const createTodoFormSchema = z.object({
    title: z.string('The title field must be a string.')
        .min(1, 'The title field is required'),
});