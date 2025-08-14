<script>
    import Metadata from "$docs/metadata.svelte";

    const exemples = [
        {title: "Simple login form", description: "A simple login form to show you the basics", url: "/exemples/login-form"},
    ]
</script>
<Metadata
        title="Exemples"
        description="Exemples using faurm, a remote form function library for SvelteKit"
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
