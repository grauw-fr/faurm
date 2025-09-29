<script lang="ts">
    import {createTodo} from "./lib/todos.remote.js";
    import {useFaurm} from "$lib/index.js";
    import {createTodoFormSchema} from "./lib/schema.js";

    const form = useFaurm(createTodo, {
        initialData: {
            title: "hello world"
        },
        onSubmit(data){
            console.log(data)
        },
        onValidationError(){
            console.log(issues);
        },
        onSuccess(){
            console.log(createTodo.result);
        },
    })

    const {data, issues, enhance} = $derived(form);

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


    <input type="submit" value="Create"/>
</form>

