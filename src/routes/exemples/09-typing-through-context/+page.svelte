<script lang="ts">
	import { useFaurm } from '$lib/use-faurm.svelte.js';
	import { createTodosFormSchema } from './lib/schema.js';
	import { createTodos } from './lib/todos.remote.js';
	import { setTodosContext } from './lib/context.svelte.js';
	import TodoField from './lib/TodoField.svelte';

	const form = useFaurm(createTodos, {
		validate: createTodosFormSchema,
		initialData: {
			todos: []
		}
	});

	const todoContext = setTodosContext({ form });
</script>

<button onclick={() => todoContext.addTodo()}>Add a todo</button>

<form {...form.enhance}>
	{#each form.fields.todos.value() as _, index (index)}
		<TodoField {index} />
	{/each}
	{#if form.fields.todos.value().length > 0}
		<input type="submit" value="Submit" />
	{/if}
</form>
