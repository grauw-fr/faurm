import {createTodoFormSchema} from "./schema.js";
import {form} from "$app/server";
export const createTodo = form(createTodoFormSchema, (data) => {
    return {
        ...data
    }
});