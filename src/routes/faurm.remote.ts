import {faurm, faurmSuccess} from "$lib/index.js";
import {loginFormSchema} from "./schemas.js";
import {faurmResponse} from "$lib/faurm/shared.js";

export const login = faurm(loginFormSchema, (_) => {
    console.log("login");
    return faurmResponse.noContent();
});
export const register = faurm(loginFormSchema, async (_) => console.log("hello world"));