import {createTodoFormSchema} from "./schema.js";
import {form} from "$app/server";
export const createTodo = form(createTodoFormSchema, async (data) => {
    await sleep(10_000)
    return {
        ...data
    }
});

const sleep = (time = 500) => new Promise((resolve) => setTimeout(() => resolve(null), time))