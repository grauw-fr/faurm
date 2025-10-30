# Faurm
__faurm__ (pronounced like "form" or "foarm") is a simple library
that aims to enhance the already great [Remote Form](https://svelte.dev/docs/kit/remote-functions#form) from the even greater [SvelteKit](https://svelte.dev/docs/kit/introduction)
It's a form wrapper around SvelteKit preflight front-end validation. It adds DX niceties, namely timers, callbacks and more.

## Before we begin
Remote form function are still in their infancy. 
This library's API, like the tech it depends on is subject to frequent breaking changes.

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
    import {useFaurm} from "faurm";

    const form = useFaurm(createTodo, {
        initialData: {
            title: "A first todo"
        },
    })
    const {fields, enhance} = form;

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


```sveltehtml
To enable front-end validation, pass your schema to the useFaurm wrapper
<script lang="ts">
    import {createTodo} from "./lib/todos.remote.js";
    import {useFaurm} from "faurm";
    import {createTodoFormSchema} from "./lib/schema.js";

    const form = useFaurm(createTodo, {
        validate: createTodoFormSchema,
        initialData: {
            title: "hello world"
        },
    })

    const {fields, enhance} = form;
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
```


Event handlers allow you to react to your form submissions and their potential results
```sveltehtml
<script lang="ts">
    import {createTodo} from "./lib/todos.remote.js";
    import {useFaurm} from "faurm";

    const form = useFaurm(createTodo, {
        initialData: {
            title: "hello world"
        },
        onSubmit(data){
            console.log({submitted: data})
        },
        onValidationError(){
            console.log({issues: fields.title.issues()});
        },
        onSuccess(){
            console.log({result : createTodo.result});
        },
    })

    const {fields, enhance} = form;

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
```

The timers object can be used to indicate loading state. You can use it to disable inputs, buttons or show messages !
```sveltehtml
<script lang="ts">
    import {createTodo} from "./lib/todos.remote.js";
    import {useFaurm} from "faurm";
    import {createTodoFormSchema} from "./lib/schema.js";

    const form = useFaurm(createTodo, {
        validate: createTodoFormSchema,
        initialData: {
            title: "hello world"
        },
        delay: 500,
        timeout: 3000
    })

    const {fields, enhance, timers} = form;
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


```
We provide a set of barebone components to help you build accessible forms. 
```sveltehtml
<script lang="ts">
    import {createProfile} from "./lib/profil.remote.js";
    import {useFaurm} from "faurm";
    import {Control, Description, Errors, Field, Fieldset, Label, Legend} from "faurm";
    import {createProfileFormSchema} from "./lib/schema.js";

    const form = useFaurm(createProfile, {
        validate: createProfileFormSchema,
        initialData: {
            name: "Alex"
        },
        delay: 500,
        timeout: 3000
    })
</script>

<form {...form.enhance} enctype="multipart/form-data">
    <Field {form} name="name">
        <Control>
            {#snippet children({props, field})}
                <Label>What is your name</Label>
                <input autocomplete="given-name" {...props} {...field.as('text')}/>
            {/snippet}
        </Control>
        <Description>Your given birth name</Description>
        <Errors/>
    </Field>

    <Field {form} name="bio">
        <Control>
            {#snippet children({props, field})}
                <Label>Biography</Label>
                <textarea {...props} {...field.as("text")}></textarea>
            {/snippet}
        </Control>
        <Description>Tell us about yourself</Description>
        <Errors/>
    </Field>

    <Fieldset {form} name="favorite_framework">
        <Legend>What is your favorite framework</Legend>
        <Control>
            {#snippet children({props, field})}
                <input {...props} {...field.as('radio', 'SvelteKit')}/>
                <Label>SvelteKit</Label>
            {/snippet}
        </Control>
        <Control>
            {#snippet children({props, field})}
                <input {...props} {...field.as('radio', 'Svelte')}/>
                <Label>Svelte</Label>
            {/snippet}
        </Control>
        <Control>
            {#snippet children({props, field})}
                <input {...props} {...field.as('radio', 'Kit')}/>
                <Label>Kit</Label>
            {/snippet}
        </Control>
        <Errors />
    </Fieldset>

    <Fieldset {form} name="privacy_options">
        <Legend>I agree to</Legend>
        <Control>
            {#snippet children({props, field})}
                <input {...props} {...field.as('checkbox', 'marketing')}/>
                <Label>Receive marketing emails</Label>
            {/snippet}
        </Control>
        <Control>
            {#snippet children({props, field})}
                <input {...props} {...field.as('checkbox', 'newsletter')}/>
                <Label>Receive our daily newsletter</Label>
            {/snippet}
        </Control>
        <Control>
            {#snippet children({props, field})}
                <input {...props} {...field.as('checkbox', 'all')}/>
                <Label>Receive all emails</Label>
            {/snippet}
        </Control>

        <Errors />
    </Fieldset>

    <Field {form} name="profile_picture">
        <Control>
            {#snippet children({props, field})}
                <Label>Profile Picture</Label>
                <input {...props} {...field.as('file')}/>
            {/snippet}
        </Control>
        <Description>Please provide a recent picture of yourself</Description>
        <Errors />
    </Field>
    <input type="submit" value="Submit"/>
</form>
```


## Features
- [X] Typesafe form enhancer with callbacks and timers
- [X] Integrate new Svelte Kit form functionalities ? Client driven single flight mutation could be used 
- [X] Accessible components 
- [ ] Extract constraints from our validation
- [ ] Draw the rest of the owl


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Who are we ?
We are the French digital agency GRAUW.
We love to build websites and apps, mainly using Laravel, Vue and SvelteKit.
Feel free to reach out ! 
[GRAUW.](https://grauw.fr/)