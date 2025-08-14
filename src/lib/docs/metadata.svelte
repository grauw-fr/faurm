<script lang="ts">
    import {page} from "$app/state";

    const {
        title,
        description,
        keywords = ["SvelteKit", "SvelteKit form", "SvelteKit form manager", "SvelteKit form validation"],
        ogType = "website",
    }: {
        title?: string;
        description?: string;
        keywords?: string[];
        ogType?: string;
    } = $props();

    const name = "faurm";
    const url = "https://faurm.grauw.dev"
    const fullTitle = $derived(
        `${title} - ${name}`
    );

</script>

<svelte:head>
    <title>{fullTitle}</title>
    <meta name="description" content={description}/>
    <meta name="keywords" content={keywords?.join(",")}/>
    <meta name="author" content="GRAUW."/>
    <meta name="creator" content="GRAUW."/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:site" content={url}/>
    <meta name="twitter:title" content={title}/>
    <meta name="twitter:description" content={description}/>
    <meta name="twitter:creator" content="@grauw"/>
    <meta property="og:title" content={title}/>
    <meta property="og:url" content={url + page.url.pathname}/>
    <meta property="og:type" content={ogType}/>
    <meta property="og:image:alt" content={title}/>
    <meta property="og:description" content={description}/>
    <meta property="og:site_name" content={name}/>
    <meta property="og:locale" content="EN_US"/>
</svelte:head>