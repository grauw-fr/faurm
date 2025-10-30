<script lang="ts">
    import {getFaurmFieldContext} from "$lib/components/use-faurm-field.svelte.js";
    import type {Snippet} from "svelte";

    const state = getFaurmFieldContext();
    state.hasErrors = true

    type FieldErrorsProps = {
        children?: Snippet<[{ issues: ReturnType<typeof state.field.issues> }]>
    }

    const {children}: FieldErrorsProps = $props();
    const fieldIssue = $derived(state.field.issues()?.map(m => m.message))
</script>

{#if children}
    {@render children({issues: state.field.issues()})}
{:else}
    {#if state.field.issues() !== undefined}
        <div id={state.describedByErrorsId}>
            {fieldIssue}
        </div>
    {/if}
{/if}