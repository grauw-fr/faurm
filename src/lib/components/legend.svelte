<script lang="ts">
    import type {LegendProps} from "../types.js";
    import {getFaurmFieldContext} from "../index.js";

    const {children, child, ...restProps}: LegendProps = $props();
    const state = getFaurmFieldContext();

    const mergedProps = $derived({
        'data-faurm-invalid': state.field.issues() === undefined ? undefined : true,
        ...restProps
    });

</script>

{#if child}
    {@render child({props: mergedProps})}
{:else}
    <legend {...mergedProps}>
        {@render children?.()}
    </legend>
{/if}