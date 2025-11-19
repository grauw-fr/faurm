<script lang="ts">

    import {useId} from "../use-id.js";
    import type {FieldProps} from "../types.js";
    import {setFaurmFieldContext} from "../index.js";

    const propId = $props.id();
    const {field, children, id}: FieldProps = $props();

    setFaurmFieldContext(field, {id: useId(id ?? propId)});

</script>

{@render children?.()}