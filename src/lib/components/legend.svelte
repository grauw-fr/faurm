<script lang="ts">
    import type {Snippet} from "svelte";
    import type {HTMLAttributes} from "svelte/elements";

    export type FieldSetProps = HTMLAttributes<HTMLLegendElement> & {
        children: Snippet,
    }
    const {children}: FieldSetProps = $props();
</script>

<legend>
    {@render children?.()}
</legend>
