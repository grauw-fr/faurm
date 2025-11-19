import z from "zod/v4";

export const createPostFormSchema = z.object({
    title: z.string()
        .min(1),
    content: z.string()
        .min(1),
});