<script lang="ts">
    import {createTodo} from "./lib/todos.remote.js";
    import {useFaurm} from "$lib/index.js";
    import {createTodoFormSchema} from "./lib/schema.js";

    const form = useFaurm(createTodo, {
        validate: createTodoFormSchema,
        initialData: {
            title: "hello world"
        },
    })

    const {fields, enhance} = $derived(form);
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


    <input type="submit" value="Create"/>
</form>

