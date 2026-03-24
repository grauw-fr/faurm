import z from "zod/v4";

export const createProfileFormSchema = z.object({
    name: z.string()
        .min(1),
    bio: z.string()
        .min(1),
    favorite_framework: z.enum(['SvelteKit','Svelte','Kit']),
    privacy_options: z.array(z.string()).optional(),
    profile_picture: z.file()
});