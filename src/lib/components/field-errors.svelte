<script lang="ts">
    import type {FieldErrorsProps} from "$lib/index.js";
    import {getFaurmFieldContext} from "$lib/index.js";

    const state = getFaurmFieldContext();

    state.hasErrors = true

    const {children, ...restProps}: FieldErrorsProps = $props();

    const mergedProps = {
        id: state.describedByErrorsId,
        ...restProps,
    }
</script>

{#if children}
    {@render children({issues: state.field.issues(), props: mergedProps})}
{:else}
    {#if state.field.issues() !== undefined}
        <div {...mergedProps}>
            {state.field.issues()?.map(m => m.message).join(', ')}
        </div>
    {/if}
{/if}