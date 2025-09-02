import {faurm, faurmSuccess} from "$lib/index.js";
import {loginFormSchema} from "./schemas.js";

export const login = faurm(loginFormSchema, (_) => faurmSuccess.ok({somekey: "somevalue"}));