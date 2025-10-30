<script lang="ts">
    import type {Snippet} from "svelte";
    import type {HTMLAttributes} from "svelte/elements";
    import {getFaurmFieldContext} from "$lib/components/use-faurm-field.svelte.js";

    type FieldDescriptionProps = HTMLAttributes<any> & {
        child?: Snippet<[props: HTMLAttributes<any>]>
        children?: Snippet<[props: HTMLAttributes<any>]>
    }
    const {child, children, ...restProps}: FieldDescriptionProps = $props();

    const state = getFaurmFieldContext();

    state.hasDescription = true

    const mergedProps = $derived({
        id: state.describedByDescriptionId,
        ...restProps
    })

</script>

{#if child}
    {@render child(mergedProps)}
{:else}
    <div {...mergedProps}>
        {@render children?.()}
    </div>
{/if}

