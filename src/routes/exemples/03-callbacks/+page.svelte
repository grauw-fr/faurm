<script lang="ts">
	import { createTodos } from './lib/todos.remote.js';
	import { useFaurm } from '$lib/index.js';

	const form = useFaurm(createTodos, {
		initialData: {
			title: 'hello world'
		},
		onSubmit(data) {
			console.log({ submitted: data });
		},
		onValidationError() {
			console.log({ issues: fields.title.issues() });
		},
		onSuccess() {
			console.log({ result: createTodos.result });
		}
	});

	const { fields, enhance } = form;
</script>

<form {...enhance}></form>
