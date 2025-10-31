<script lang="ts" generics="TContext extends FaurmContext<any, any>">
    import type {FaurmContext} from "../use-faurm.svelte.js"
    import type {FieldSetProps} from "../types.js";
    import {Field} from "../components/index.js";

    const {form, name, child, children, ...restProps}: FieldSetProps<TContext> = $props();
</script>

<Field {form} {name}>
    {#if child}
        {@render child({props: restProps})}
    {:else}
        <fieldset {...restProps}>
            {@render children?.()}
        </fieldset>
    {/if}
</Field>