import {createPostFormSchema} from "./schema.js";
import {form} from "$app/server";
export const createPost = form(createPostFormSchema, async (data) => console.log(data));