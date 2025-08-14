<script>
    import Metadata from "$docs/metadata.svelte";
</script>

<Metadata
        title="Remote form function library for SvelteKit"
        description="SvelteKit remote form function, now with with validation and more !"
></Metadata>

<section id="introduction">
    <hgroup>
        <h1>FAURM, a remote form function library for SvelteKit</h1>
        <p>SvelteKit remote form function, now with with validation and more !</p>
    </hgroup>
    <p>
        <strong>faurm</strong> (pronounced like "form" or "foarm") is a simple library that aims to enhance the already
        great <a target="_blank" href="https://svelte.dev/docs/kit/remote-functions#form" rel="nofollow">Remote Form</a> from the even
        greater
        <a target="_blank" href="https://svelte.dev/docs/kit">SvelteKit</a>

        It brings an opinionated way of handling backend typed validation for your form functions.
    </p>
</section>

<section id="installation">
    <h2>Installation</h2>
    <p>Installing <strong>faurm</strong> is as easy as running</p>
    <pre><code>npm i faurm</code></pre>
</section>

<section id="how-it-works">
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


    <h2>What's next ? </h2>
    <p>This library will evolve with the needs of our developers.</p>
    <p>
        Right now, we would like add the following features:
    </p>
    <ul>
        <li>
            <del>Typesafe backend validation of forms, using [standard
                schemas](https://github.com/standard-schema/standard-schema)
            </del>
        </li>
        <li>[ ] Write an enhancer</li>
        <li>[ ] Devise ways to handle more complexe validation schemas (file inputs, nested schemas, etc)</li>
        <li>[ ] Add a form state manager</li>
        <li>[ ] Make Faurm work with (Formsnap)[https://formsnap.dev/docs]</li>
        <li>[ ] Add more exemples</li>
    </ul>
    <p>Want to add a feature to the list ? Pop over to <a href="https://github.com/grauw-fr/faurm" rel="nofollow" target="_blank">github</a>
        and create an issue !</p>
</section>