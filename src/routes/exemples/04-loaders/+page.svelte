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

    const {data, issues, enhance, timers} = $derived(form);
    $inspect(data, issues);

</script>

<form {...enhance}>
    <label>
        Title
        <input name="title" placeholder="title"
               aria-invalid={!!issues?.["title"]}
               aria-describedby={issues?.["title"] ? `invalid-title-helper` : null}
               bind:value={data.title}
        />

        {#if issues?.['title'] }
            <small id={`invalid-title-helper`}>
                {issues['title']
                    .map(i => i.message)
                    .join(', ')}
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

