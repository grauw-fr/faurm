<script lang="ts" generics="TContext extends FaurmContext<any, any>">
    import type {FaurmContext} from "$lib/use-faurm.svelte.js"
    import type {Snippet} from "svelte";
    import type {HTMLFieldsetAttributes} from "svelte/elements";
    import {Field} from "$lib/components/index.js";
    import type {FieldProps} from "$lib/types.js";

    type FieldSetProps = Omit<HTMLFieldsetAttributes, 'form'> & FieldProps<TContext>  & {
        children: Snippet,
    }
    const {form, name, children, ...restProps}: FieldSetProps = $props();

</script>

<Field {form} {name}>
    <fieldset {...restProps}>
        {@render children?.()}
    </fieldset>
</Field>