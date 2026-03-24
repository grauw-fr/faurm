<script lang="ts" generics="TFieldValue extends FaurmContext<any, any>">
    import type {FaurmContext} from "../use-faurm.svelte.js"
    import type {FieldSetProps} from "../types.js";
    import {Field} from "../components/index.js";

    const {field, child, children, ...restProps}: FieldSetProps = $props();
</script>

<Field {field}>
    {#if child}
        {@render child({props: restProps})}
    {:else}
        <fieldset {...restProps}>
            {@render children?.()}
        </fieldset>
    {/if}
</Field>