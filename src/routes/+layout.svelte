<script>
    import {page} from "$app/stores";

    let root = globalThis?.document?.documentElement;
    let localStorage = globalThis.localStorage ?? {};
    let colorScheme = localStorage.colorScheme ?? "light dark";
    $: localStorage.colorScheme = colorScheme;

    $: root?.style.setProperty("color-scheme", colorScheme)
    
    let pages = [
  { url: "./", title: "Home" },
  { url: "./projects", title: "Projects" },
  { url: "./contact", title: "Contact Info" },
  { url: "./resume", title: "CV" },
  { url: "./meta", title: "Meta"},
  {
    url: "https://github.com/therealnalm",
    title: "Github",
  },
  
    ]
    // console.log('we at current? ' + $page.route.id)
</script>


 	<label class='color-scheme'>
 		Theme:
 		<select bind:value = { colorScheme }>
 			<option value = "dark">Dark</option>
             <option value = "light">Light</option>
             <option value = "light dark">Automatic</option>
 		</select>
 	</label>

<nav>
    {#each pages as p}
    <a href={p.url} class:current={"." + $page.route.id === p.url}
    target={p.url.startsWith("http") ? "_blank": null}>
        {p.title}
      </a>
    {/each}
</nav>
<slot />

<style lang="scss">
nav {
    display: flex;
    margin-bottom: 3ch;
    border-bottom: 1px solid oklch(80% 3% 200);    
  }

  a {
      flex: 1;
      text-decoration: none;
      color: inherit;
      text-align: center;
      padding: 0.05em;
    }
  
    a:hover {
      border-bottom: 0.4em solid var(--color-accent);
      background-color: color-mix(
        in oklch,
        var(--color-accent-light),
        canvas 85%
      );
    }
    .current {
      font-weight: bold;
      border-bottom: 0.4em solid oklch(50% 1% 200/ 40%);
    }
</style>