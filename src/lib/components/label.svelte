<script lang="ts">
    import type {Snippet} from "svelte";
    import type {HTMLAttributes} from "svelte/elements";
    import {getFaurmFieldControlContext,} from "$lib/components/use-faurm-field-control.svelte.js";

    type FieldControlProps = HTMLAttributes<HTMLLabelElement> & {
        child?: Snippet<[HTMLAttributes<HTMLLabelElement>]>
        children?: Snippet
    }
    const {child, children, ...restProps}: FieldControlProps = $props();

    const controlState = getFaurmFieldControlContext()

    const mergedProps = {
        for: controlState.id,
        ...restProps,
    }
</script>


{#if child}
    {@render child?.(mergedProps)}
{:else}
    <label {...mergedProps}>{@render children?.()}</label>
{/if}

