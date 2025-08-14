<script>
    import Metadata from "$docs/metadata.svelte";

    const exemples = [
        {title: "Simple login form", description: "A simple login form to show you the basics", url: "/exemples/login-form"},
    ]
</script>
<Metadata
        title="Remote form function library for SvelteKit"
        description="SvelteKit remote form function, now with with validation and more !"
></Metadata>

<section>
    <hgroup>
        <h1>Faurm Exemples</h1>
        <p>Working exemples of faurm with code snippets</p>
    </hgroup>
</section>

<section class="grid">
    {#each exemples as {title, description, url}}
        <a href={url}>
            <article>
                <header>{title}</header>
                {description}
            </article>
        </a>
    {/each}
</section>
