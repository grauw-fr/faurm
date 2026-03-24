import {createProfileFormSchema} from "./schema.js";
import {form} from "$app/server";
export const createProfile = form(createProfileFormSchema, async (data) => console.log(data));