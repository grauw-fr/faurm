import {faurm, faurmSuccess} from "$lib/index.js";
import {loginFormSchema} from "./schemas.js";

export const login = faurm(loginFormSchema, (_) => console.log("hello world"));