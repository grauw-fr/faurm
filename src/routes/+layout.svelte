<script lang="ts">
    import '../app.css';

    const {children} = $props()
</script>

<header>
    <nav class="container">
        <ul>
            <li><a href="/" id="faurm__logo"><strong>FAURM <small>by GRAUW.</small></strong></a></li>
        </ul>
        <ul>
            <li><a href="/exemples">Exemples</a></li>
            <li><a href="https://github.com/grauw-fr/faurm" target="_blank" rel="nofollow">Github</a></li>
        </ul>
    </nav>
</header>
<main class="container">
    {@render children()}
</main>
<footer class="container">
    <p>Made with ❤️ by <a href="https://grauw.fr" target="_blank">GRAUW.</a></p>
    <small>
        <a href="https://picocss.com/" target="_blank">Built with PicoCss</a>
    </small>
</footer>


<style>
    #faurm__logo {
        text-decoration: none;
        color: white;
    }

    #faurm__logo:hover, #faurm__logo:focus, #faurm__logo:hover, #faurm__logo:visited {
        text-decoration: none;
        color: white;
    }
</style>
