<script lang="ts">
	import type { DescriptionProps } from '../types.js';
	import { getFaurmFieldContext } from '../index.js';

	const { child, children, ...restProps }: DescriptionProps = $props();

	const state = getFaurmFieldContext();

	state.hasDescription = true;

	const mergedProps = $derived({
		id: state.describedByDescriptionId,
		'data-faurm-invalid': state.field().issues() === undefined ? undefined : true,
		...restProps
	});
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
