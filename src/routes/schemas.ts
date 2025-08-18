import z from "zod/v4";

export const loginFormSchema = z.object({
    email: z.email('The email field must be a valid email address.'),
    password: z.string()
        .min(1, 'The password is required')
});