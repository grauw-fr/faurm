import { createTodoFormSchema } from './schema.js';
import { form } from '$app/server';
export const createTodos = form(createTodoFormSchema, (data) => {
	return {
		...data
	};
});
