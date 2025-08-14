<script lang="ts">
    import {login} from './login-form.remote.js'
    import Metadata from "$docs/metadata.svelte";

    const errors = $derived(
        login.result?.type === "failure" &&
        login.result.status === 422 &&
        login.result.errors || {}
    )
</script>
<Metadata
        title="Login form exemple"
        description="SvelteKit remote form function, now with with validation and more !"
></Metadata>

<small><a href="https://github.com/grauw-fr/faurm/tree/07e336bf9a40dd21b4705f9b0bcb788d131dc49c/src/routes/exemples/login-form">Source on github</a></small>
<article>
    <header>
        Sign In
    </header>

    <form {...login}>
        <fieldset>
            <label>
                Email
                <input
                        name="email"
                        placeholder="Email"
                        aria-invalid={!!errors['email'] || null}
                        aria-describedby={!!errors['email'] ? 'invalid-email-helper' : null}
                />
                {#if errors['email']}
                    <small id="invalid-email-helper">
                        {errors['email'].join(', ')}
                    </small>
                {/if}
            </label>
            <label>
                Password
                <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        autocomplete="current-password"
                        aria-invalid={!!errors['password'] || null}
                        aria-describedby={!!errors['password'] ? 'invalid-password-helper' : null}
                />
                {#if errors['password']}
                    <small id="invalid-email-helper">
                        {errors['password'].join(', ')}
                    </small>
                {/if}
            </label>

        </fieldset>
        <input type="submit" value="Sign In"/>
    </form>

    <pre><code>{JSON.stringify(login.result, null, 2)}</code></pre>

</article>

<section>
    <pre><code>{`// /src/routes/exemples/login-form/login-form.remote.ts
import z from 'zod/v4';
import {faurm, faurmSuccess} from 'faurm';

const loginFormSchema = z.object({
    email: z.email('The email field must be a valid email address.'),
    password: z.string()
        .min(1, 'The password is required')
});


export const login = faurm(loginFormSchema, (data) => {
    // TODO: Run your logic here.

    return faurmSuccess.ok(data);
});

// /src/routes/exemples/login-form/+page.svelte
<\script>
    import {login} from './login-form.remote.js'
    import Metadata from "$docs/metadata.svelte";

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
                    aria-describedby={!!errors['email'] ? 'invalid-email-helper' : null}
            />
            {#if errors['email']}
                <small id="invalid-email-helper">
                    {errors['email'].join(', ')}
                </small>
            {/if}
        </label>
        <label>
            Password
            <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    autocomplete="current-password"
                    aria-invalid={!!errors['password'] || null}
                    aria-describedby={!!errors['password'] ? 'invalid-password-helper' : null}
            />
            {#if errors['password']}
                <small id="invalid-email-helper">
                    {errors['password'].join(', ')}
                </small>
            {/if}
        </label>

    </fieldset>
    <input type="submit" value="Sign In"/>
</form>`}</code></pre>
</section>