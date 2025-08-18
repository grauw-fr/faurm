import {faurm, faurmSuccess} from "$lib/index.js";
import {loginFormSchema} from "./schemas.js";

export const login =
    faurm(loginFormSchema, (data) =>
        faurmSuccess.ok(Object.fromEntries(data.entries())));