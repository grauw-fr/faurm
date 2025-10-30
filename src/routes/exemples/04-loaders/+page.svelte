<script lang="ts">
    import {createTodo} from "./lib/todos.remote.js";
    import {useFaurm} from "$lib/index.js";
    import {createTodoFormSchema} from "./lib/schema.js";

    const form = useFaurm(createTodo, {
        validate: createTodoFormSchema,
        initialData: {
            title: "hello world"
        },
        delay: 500,
        timeout: 3000
    })

    const {fields, enhance, timers} = $derived(form);
</script>

<form {...enhance}>
    <label>
        Title
        <input {...fields.title.as('text')}
               aria-describedby={fields.title.issues() ? `invalid-title-helper` : null}/>
        {#if fields.title.issues() !== undefined }
            <small id={`invalid-title-helper`}>
                {(fields.title.issues() ?? []).map(i => i.message).join(', ')}
            </small>
        {/if}
    </label>


    <input type="submit" value="{timers.submitting ? 'loading': 'Create'}"/>
    {#if timers.delayed}
        <p>Loading, with a small delay</p>
    {/if}

    {#if timers.timeout}
        <p>It's been 3 seconds already ? </p>
    {/if}
</form>

