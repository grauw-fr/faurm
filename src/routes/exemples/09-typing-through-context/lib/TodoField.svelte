<script lang="ts">
	import { getTodosContext } from './context.svelte.js';
	import { Control, FieldErrors, Field, Label, FormFieldset } from '$lib/components/index.js';
	import Fieldset from '$lib/components/fieldset.svelte';
	import { id } from 'zod/v4/locales';

	type TodoFieldProps = {
		index: number;
	};

	const { index }: TodoFieldProps = $props();
	const context = getTodosContext();
	const todo = $derived(context.form.fields.todos[index]!);
</script>

<div style="background: #f1f1f1; margin-top: 5px;">
	<input {...todo.id.as('hidden', todo.id.value()!)} />
	<Field field={todo.title}>
		<Control>
			{#snippet children({ props, field })}
				<Label>Title</Label>
				<input {...props} {...field.as('text')} />
			{/snippet}
		</Control>
		<FieldErrors />
	</Field>

	<Field field={todo.date}>
		<Control>
			{#snippet children({ props, field })}
				<Label>Content</Label>
				<input {...props} {...field.as('date')} />
			{/snippet}
		</Control>
		<FieldErrors />
	</Field>
</div>
