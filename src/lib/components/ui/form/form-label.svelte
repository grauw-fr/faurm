<script lang="ts">
    import {Label} from "$lib/index.js";
    let {
        ref = $bindable(null),
        children,
        class: className,
        ...restProps
    }: WithoutChild<FormPrimitive.LabelProps> = $props();
</script>

<Label {...restProps}>
    {#snippet child({ props })}
        <label
                {...props}
                data-slot="form-label"
        >
            {@render children?.()}
        </label>
    {/snippet}
</Label>
