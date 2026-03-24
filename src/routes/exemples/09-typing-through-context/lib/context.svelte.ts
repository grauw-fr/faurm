import { getContext, setContext } from 'svelte';
import type { InferFaurmContext } from '$lib/types.js';
import { createTodos } from './todos.remote.js';

type TodosContextOpts = {
	form: InferFaurmContext<typeof createTodos>;
};

const TODOS_CONTEXT_KEY = Symbol('todos-context-key');
export const setTodosContext = (init: TodosContextOpts) => {
	return setContext(TODOS_CONTEXT_KEY, new TodosContext(init));
};
export const getTodosContext = (): ReturnType<typeof setTodosContext> => {
	return getContext(TODOS_CONTEXT_KEY);
};

class TodosContext {
	form: InferFaurmContext<typeof createTodos>;

	constructor(init: TodosContextOpts) {
		this.form = init.form;
	}

	public addTodo() {
		this.form.fields.todos.set([...this.form.fields.todos.value(), { id: crypto.randomUUID() }]);
	}
}
