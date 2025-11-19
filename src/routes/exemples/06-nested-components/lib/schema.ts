import z from "zod/v4";

export const createTodosFormSchema = z.object({
    todos: z.array(
        z.object({
            title: z.string().min(1),
            done: z.boolean().default(false)
        })
    )
});