<script lang="ts">
    import type {Snippet} from "svelte";
    import {getFaurmFieldContext} from "$lib/components/use-faurm-field.svelte.js";
    import type {HTMLAttributes} from "svelte/elements";
    import {setFaurmFieldControlContext} from "$lib/components/use-faurm-field-control.svelte.js";

    const state = getFaurmFieldContext();
    const controlState = setFaurmFieldControlContext(state.id)

    type FieldControlProps = {
        children: Snippet<[{ props: any, field: typeof state.field }]>
    }

    const {children, ...restProps}: FieldControlProps = $props();

    const describedBy = $derived.by(() => {
        if (!state.hasDescription && !state.hasErrors){
            return undefined
        }

        const describedBy = [];
        if (state.hasDescription){
            describedBy.push([
                `description-${state.id}`
            ])
        }

        if (state.hasErrors && state.field.issues() !== undefined){
            describedBy.push([
                `errors-${state.id}`
            ])
        }

        return describedBy.join(' ')
    })

    const mergedProps: HTMLAttributes<any> = $derived({
        id: controlState.id,
        'aria-describedby': describedBy,
        ...restProps
    })
</script>

{@render children?.({props: mergedProps, field: state.field})}