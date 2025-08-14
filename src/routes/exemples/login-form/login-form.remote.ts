import z from 'zod/v4';
import {faurm, faurmSuccess} from 'faurm';

const loginFormSchema = z.object({
    email: z.email('The email field must be a valid email address.'),
    password: z.string()
        .min(1, 'The password is required')
});


export const login = faurm(loginFormSchema, (data) => {
    // TODO: Run your logic here.

    return faurmSuccess.ok(data);
});