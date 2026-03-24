<script lang="ts">
    import {useFaurm} from "$lib/use-faurm.svelte.js";
    import {Control, Description, FieldErrors, Field, Fieldset, Label, Legend} from "$lib/components/index.js";
    import {createPostFormSchema} from "./lib/schema.js";
    import {createPost} from "./lib/posts.remote.js";

    const form = useFaurm(createPost, {
        validate: createPostFormSchema,
        initialData: {
            title: "Hello World",
            content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi blanditiis culpa dignissimos dolor dolorum eos id ipsam mollitia nam nesciunt perferendis praesentium, quas, qui quo repellat sapiente totam vitae voluptates!"
        },
    })

    const {fields} = form
</script>

<form {...form.enhance} enctype="multipart/form-data">
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

<div>
    <p>Title</p>
    <p>{fields.title.value()}</p>
</div>
<div>
    <p>Content</p>
    {@html fields.content.value()}
</div>