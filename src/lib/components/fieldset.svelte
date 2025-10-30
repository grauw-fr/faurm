<script lang="ts" generics="TContext extends FaurmContext<any, any>">
    import type {FaurmContext} from "$lib/use-faurm.svelte.js"
    import {Field} from "$lib/components/index.js";
    import type {FieldSetProps} from "$lib/types.js";

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