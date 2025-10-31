<script lang="ts">
    import type {HTMLAttributes} from "svelte/elements";
    import type {FieldControlProps} from "../types.js";
    import {getFaurmFieldContext, setFaurmFieldControlContext} from "../index.js";

    const state = getFaurmFieldContext();
    const controlState = setFaurmFieldControlContext(state.id)

    const {children, ...restProps}: FieldControlProps<typeof state.field> = $props();

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