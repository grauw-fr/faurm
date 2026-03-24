<script lang="ts">
	import { createTodos } from './lib/todos.remote.js';
	import { useFaurm } from '$lib/use-faurm.svelte.js';
	import { createTodosFormSchema } from './lib/schema.js';
	import { Control, Field, Label, FieldErrors } from '$lib/components/index.js';

	const form = useFaurm(createTodos, {
		validate: createTodosFormSchema,
		resetForm: false,
		initialData: {
			todos: [
				{
					title: 'Todo n°1',
					done: true
				},
				{
					title: 'Todo n°2',
					done: true
				}
			]
		}
	});

	const { enhance, fields } = form;
</script>

<form {...enhance} enctype="multipart/form-data">
	{#each fields.todos.value() as _, i}
		<Field field={fields.todos[i].title}>
			<Control>
				{#snippet children({ props, field })}
					<Label>Title</Label>
					<input {...props} {...field.as('text')} />
				{/snippet}
			</Control>
		</Field>
		<Field field={fields.todos[i].done}>
			<Control>
				{#snippet children({ props, field })}
					<Label>Done</Label>
					<input {...props} {...field.as('checkbox')} />
				{/snippet}
			</Control>
		</Field>
		<br />
	{/each}
	<button
		type="button"
		onclick={() => fields.todos.set([...fields.todos.value(), { done: false, title: '' }])}
		>Add todo</button
	>
	<input type="submit" value="Submit" />
</form>

<pre>{JSON.stringify(fields.value(), null, 2)}</pre>
