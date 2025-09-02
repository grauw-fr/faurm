# Faurm
__faurm__ (pronounced like "form" or "foarm") is a simple library
that aims to enhance the already great [Remote Form](https://svelte.dev/docs/kit/remote-functions#form) from the even greater [SvelteKit](https://svelte.dev/docs/kit/introduction)
It brings a way to handle backend and frontend validation for your exported form functions.

## Installation
```shell
npm install faurm
```

## Get Started

Write a schema of you file using any [standard schema compliant library](https://standardschema.dev/)
```js
// /src/lib/schemas.ts
export const loginFormSchema = z.object({
    email: z.email('The email field must be a valid email address.'),
    password: z.string()
        .min(1, 'The password is required')
});
```

Pass the schema to an exported remote faurm function.  
```ts
// /src/lib/auth.remote.ts
import {faurm} from 'faurm';
import {loginFormSchema} from '$lib/schemas.ts'

export const login = faurm(loginFormSchema, (data: FormData) => {
    // The rest of the owl
});
```

Use it as you would a regular remote function.  
```sveltehtml
<script lang="ts">
    import {login} from "$lib/auth.remote";
</script>

<form {...login}>
    <fieldset>
        <label>
            Email
            <input name="email" /> 
            <!-- The rest of the owl -->
```

The library uses the "result" to communicate back validation failure. The "result" property has the following typesafe structure
```ts
    type FaurmResult<Schema extends StandardSchemaV1, Output = any> =
    | { type: "failure", status: 422, errors:  Faurm.FaurmValidationError<Schema>['errors']}
    | { type: "success", status: 204 }
    | { type: "success", status: 200 | 201, data: Output };
```

The library uses the "result" to communicate back validation results. The "result" property has the following typesafe structure
```sveltehtml
<script lang="ts">
    import {login} from "$lib/auth.remote";
    
    const errors = $derived(
            login.result?.type === "failure" &&
            login.result.status === 422 &&
            login.result.errors || {}
    )
</script>

<form {...login}>
    <fieldset>
        <label>
            Email
            <input
                name="email"
                placeholder="Email"
                aria-invalid={!!errors['email'] || null}
                aria-describedby={errors['email'] ? 'invalid-email-helper' : null}
            />
            {#if errors['email']}
                <small id="invalid-email-helper">
                    {errors['email'].join(', ')}
                </small>
            {/if}
        </label>
        <!-- The rest of the owl -->
```

Enhance your form using the useFaurm helper. You get front-end validation out the box.
```sveltehtml

<script lang="ts">
    import {login} from "$lib/auth.remote";
    import {loginFormSchema} from '$lib/schemas.ts'

    import {useFaurm} from "faurm";

    const {data, errors, enhance} = useFaurm({
        validator: loginFormSchema,
        initialData: {
            email: 'faurm@grauw.fr',
        },
        remoteFn: login
    })
</script>

<form {...enhance}>
    <fieldset>
        <label>
            Email
            <input
                    name="email"
                    placeholder="Email"
                    aria-invalid={!!errors['email'] || null}
                    aria-describedby={errors['email'] ? 'invalid-email-helper' : null}
            />
            {#if errors['email']}
                <small id="invalid-email-helper">
                    {errors['email'].join(', ')}
                </small>
            {/if}
        </label>
        <!-- The rest of the owl -->
```
Event handlers allow you to react to your form submissions and their potential results
```sveltehtml

<script lang="ts">
    import {login} from "$lib/auth.remote";
    import {loginFormSchema} from '$lib/schemas.ts'

    import {useFaurm} from "faurm";

    const {data, errors, enhance} = useFaurm({
        validator: loginFormSchema,
        initialData: {
            email: 'faurm@grauw.fr',
        },
        remoteFn: login,
        onSubmit(){
            //Front-end validation succeeded 
            console.log(data, errors)
        },
        onSuccess(){
            // The remote form function returned a success.
            // Here you might want to show a toast
            console.log(data, errors)
        },
        onError(){
            // The remote form function returned validation error.
            // Here you might want to show a toast or an alert
            console.log(data, errors)
        }
        // The rest of the owl
    })
```

The timers object can be used to indicate loading state. You can use it to disable inputs, buttons or show messages !
```sveltehtml

<script lang="ts">
    import {login} from "./faurm.remote.js";
    import {loginFormSchema} from "./schemas.js";
    import {useFaurm} from "faurm";

    const {enhance, timers} = useFaurm({
        validator: loginFormSchema,
        remoteFn: login,
    })
</script>

<form {...enhance}>
    <!-- The rest of the owl -->
    <input type="submit" value="Sign In" disabled={timers.delayed}/>
    {#if timers.submitting}
        <!-- Can be flashy if the response is near instant. -->
    {/if}

    {#if timers.delayed}
        <!-- Triggers after a small delay to indicate loading -->
        <p>Loading...</p>
    {/if}
    {#if timers.timeout}
        <!-- Triggers after a longer delay -->
        <p>Wow, this is pretty long...</p>
    {/if}
</form>


```

## Features
- [X] Typesafe backend validation of forms, using [standard schemas](https://github.com/standard-schema/standard-schema)
- [X] Typesafe form enhancer with callbacks and timers
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