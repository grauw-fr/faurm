<script lang="ts" generics="TContext extends FaurmContext<any, any>">
    import type {FaurmContext} from "../use-faurm.svelte.js"
    import {useId} from "../use-id.js";
    import type {FieldProps} from "../types.js";
    import {setFaurmFieldContext} from "../index.js";

    const propId = $props.id();
    const {form, name, children, id}: FieldProps<TContext> = $props();

    const field = form.fields[name];
    setFaurmFieldContext(field, {id: useId(id ?? propId)});

</script>

{@render children?.()}