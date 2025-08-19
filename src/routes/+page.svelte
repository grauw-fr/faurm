<script lang="ts">
    import {login} from "./faurm.remote.js";
    import {loginFormSchema} from "./schemas.js";
    import {useFaurm} from "$lib/faurm/client.svelte.js";



    const {data, errors, enhance} = useFaurm({
        validator: loginFormSchema,
        initialData: {
            email: 'alexandre',
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
                    autocomplete="username"
                    placeholder="Email"
                    aria-invalid={!!errors['email'] || null}
                    aria-describedby={errors['email'] ? 'invalid-email-helper' : null}
                    bind:value={data.email}
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
                    aria-describedby={errors['password'] ? 'invalid-password-helper' : null}
                    bind:value={data.password}
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