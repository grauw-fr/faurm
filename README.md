# Faurm
__faurm__ (pronounced like "form" or "foarm") is a simple library
that aims to enhance the already great [Remote Form](https://svelte.dev/docs/kit/remote-functions#form) from the even greater [SvelteKit](https://svelte.dev/docs/kit/introduction)
It's a form wrapper around SvelteKit preflight front-end validation. It adds DX niceties, namely timers, callbacks and more.

## Before we begin
Remote form function are still in their infancy. 
This library's API is subject to frequent breaking changes.

We still need a way to trigger validation errors from the function itself for this to be truly helpful.


## Installation
```shell
npm install faurm
```

## Get Started

Write a schema of you file using any [standard schema compliant library](https://standardschema.dev/)
```js
// ./lib/schema.ts
import z from "zod/v4";

export const createTodoFormSchema = z.object({
    title: z.string('The title field must be a string.')
        .min(1, 'The title field is required'),
});
```

Pass your schema to a remote form function.  
```ts
// ./lib/todos.remote.ts
import {createTodoFormSchema} from "./schema.js";
import {form} from "$app/server";

export const createTodo = form(createTodoFormSchema, (data) => {
    return {
        ...data
    }
});
```

Enhance your form using the useFaurm wrapper.
```sveltehtml
<script lang="ts">
    import {createTodo} from "./lib/todos.remote.js";
    import {useFaurm} from "$lib/index.js";

    const form = useFaurm(createTodo, {
        initialData: {
            title: "A first todo"
        },
    })

    const {data, issues, enhance} = $derived(form);
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


    <input type="submit" value="Create"/>
</form>
```sveltehtml
To enable front-end validation, pass your schema to the useFaurm wrapper
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

    const {data, issues, enhance} = $derived(form);
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


    <input type="submit" value="Create"/>
</form>


```


Event handlers allow you to react to your form submissions and their potential results
```sveltehtml

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


```

The timers object can be used to indicate loading state. You can use it to disable inputs, buttons or show messages !
```sveltehtml

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




```

## Features
- [X] Typesafe form enhancer with callbacks and timers
- [X] Integrate new Svelte Kit form functionalities ? Client driven single flight mutation could be used 
- [ ] Extract constraints from our validation
- [ ] Devise ways to handle more complexe validation schemas (file inputs, nested schemas, etc.)
- [ ] Draw the rest of the owl


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Who are we ?
We are the french digital agency GRAUW.
We love to build websites and apps, mainly using Laravel, Vue and SvelteKit.
Feel free to reach out ! 
[GRAUW.](https://grauw.fr/)