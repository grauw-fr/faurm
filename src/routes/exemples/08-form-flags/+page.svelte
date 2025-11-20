<script lang="ts">
    import {useFaurm} from "$lib/use-faurm.svelte.js";
    import {Control, Description, FieldErrors, Field, Fieldset, Label, Legend} from "$lib/components/index.js";
    import {createPostFormSchema} from "./lib/schema.js";
    import {createPost} from "./lib/posts.remote.js";

    const form = useFaurm(createPost, {
        validate: createPostFormSchema,
        initialData: {
            title: "Hello World",
            content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
        },
    })

    const {fields, flags} = form
</script>

<pre>{JSON.stringify(flags.value(), null, 2)}</pre>

<svelte:window onbeforeunload={(e) => flags.value().dirty && e.preventDefault()} />
{#if flags.value().dirty}
    <h2>The form has been modified</h2>
{/if}


<form {...form.enhance}>
    <Field field={fields.title}>
        <Control>
            {#snippet children({props, field})}
                <Label>Title</Label>
                <input {...props} {...field.as('text')}/>
            {/snippet}
        </Control>
        <FieldErrors/>
    </Field>

    <Field field={fields.content}>
        <Control>
            {#snippet children({props, field})}
                <Label>Content</Label>
                <textarea {...props} {...field.as("text")}></textarea>
            {/snippet}
        </Control>
        <FieldErrors/>
    </Field>

    <input type="submit" value="Submit"/>
</form>