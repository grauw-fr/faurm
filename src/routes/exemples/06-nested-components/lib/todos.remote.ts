import {createTodosFormSchema} from "./schema.js";
import {form} from "$app/server";
export const createTodos = form(createTodosFormSchema, async (data) => console.log(data));