<script lang="ts">
    import type {LabelProps} from '$lib/types.js'
    import {getFaurmFieldContext, getFaurmFieldControlContext} from "$lib/index.js";

    const {child, children, ...restProps}: LabelProps = $props();

    const state = getFaurmFieldContext();
    const controlState = getFaurmFieldControlContext()

    const mergedProps = $derived({
        for: controlState.id,
        'data-faurm-invalid': state.field.issues() === undefined ? undefined : true,
        ...restProps,
    })
</script>


{#if child}
    {@render child?.({props: mergedProps})}
{:else}
    <label {...mergedProps}>{@render children?.()}</label>
{/if}

