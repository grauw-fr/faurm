<script>
    import Metadata from "$lib/docs/metadata.svelte";
</script>
<Metadata
        title="Remote form function library for SvelteKit"
        description="SvelteKit remote form function, now with with validation and more !"
></Metadata>

<section>
    <hgroup>
        <h1>FAURM, a remote form function library for SvelteKit</h1>
        <p>SvelteKit remote form function, now with with validation and more !</p>
    </hgroup>
    <p>
        <strong>faurm</strong> (pronounced like "form" or "foarm") is a simple library that aims to enhance the already
        great <a target="_blank" href="https://svelte.dev/docs/kit/remote-functions#form">Remote Form</a> from the even
        greater
        <a target="_blank" href="https://svelte.dev/docs/kit/introduction">SvelteKit</a>

        It brings an opinionated way of handling backend typed validation for your form functions.
    </p>
</section>

<section>
    <h2>How it works</h2>
    <h3>On the server</h3>
    <p>faurm uses <a href="https://github.com/standard-schema/standard-schema">standard schemas</a> to validate your
        data before the actual remote function form call is made.
    </p>

    <pre><code>{`import z from 'zod/v4';
import {faurm} from 'faurm';

const loginFormSchema = z.object({
    email: z.email('The email field must be a valid email address.'),
    password: z.string()
    .min(1, 'The password is required')
});


export const login = faurm(loginFormSchema, data => {
    // The rest of the owl
});
`}</code></pre>

    <hr>

    <h3>On your front end</h3>

    <p>faurm populates the remote form.'result' property to pass the validation errors back to you.</p>
    <pre><code>{`login.result = {
    success: false,
    status: 422,
    errors: {
      email: ["The email field must be a valid email address."]
   }
}
`}</code></pre>
</section>
