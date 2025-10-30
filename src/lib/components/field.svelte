<script lang="ts" generics="TContext extends FaurmContext<any, any>">
    import type {FaurmContext} from "$lib/use-faurm.svelte.js"
    import {useId} from "$lib/use-id.js";
    import {setFaurmFieldContext} from "$lib/components/use-faurm-field.svelte.js";
    import type {FieldProps} from "$lib/types.js";

    const propId = $props.id();
    const {form, name, children, id}: FieldProps<TContext> = $props();

    const field = form.fields[name];
    setFaurmFieldContext(field, {id: useId(id ?? propId)});

</script>

{@render children?.()}