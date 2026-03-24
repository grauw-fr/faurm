<script lang="ts">
	import { useId } from '../use-id.js';
	import type { FieldProps } from '../types.js';
	import { setFaurmFieldContext } from '../index.js';

	const propId = $props.id();
	const { field, children, id = propId }: FieldProps = $props();

	const fieldId = $derived(useId(id ?? propId));
	setFaurmFieldContext(() => field, { id: () => fieldId });
</script>

{@render children?.()}
