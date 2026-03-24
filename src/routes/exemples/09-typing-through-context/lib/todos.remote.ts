import { form } from '$app/server';
import { createTodosFormSchema } from './schema.js';
export const createTodos = form(createTodosFormSchema, async (data) => console.log(data));
