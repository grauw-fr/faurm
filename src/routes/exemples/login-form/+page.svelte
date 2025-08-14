<script lang="ts">
    import {login} from './login-form.remote.js'
    import Metadata from "$lib/docs/metadata.svelte";

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