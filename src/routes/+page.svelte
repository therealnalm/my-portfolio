<script>
  import Project from "$lib/Project.svelte";
  import projects from "$lib/projects.json";
  let profileData = {
  ok: true,
  json: async () => ({
    followers: 100,
    following: 100,
    public_repos: 100,
    public_gists: 100,
  }),
};
</script>  

<svelte:head>
  <title>Home</title>
</svelte:head>
  
  <body>
    <h1>Benjamin Sheres</h1>
    <p>Ben is a student at MIT currently enrolled in 6.C35</p>

{#await fetch("https://api.github.com/users/therealnalm")}
<p>Loading...</p>
{:then profileData}
  {#await profileData.json()}
    <p>Decoding...</p>
  {:then data}
    <section>
      <h2>My GitHub Stats</h2>
      <dl>
        <dt>Followers:</dt>
        <dd>{data.followers}</dd>
        <dt>Following:</dt>
        <dd>{data.following}</dd>
        <dt>Public Repositories:</dt>
        <dd>{data.public_repos}</dd>
      </dl>
    </section>
  {:catch error}
    <p class="error">Something went wrong: {error.message}</p>
  {/await}
{:catch error}
  <p class="error">Something went wrong: {error.message}</p>
{/await}

    <img src="images/MG_2664.jpg" alt="Ben in Tux" />

    <h2>Latest Projects:</h2>
    <div class="projects">
    {#each projects.slice(0, 3) as p}
<Project data={p} hLevel = 3 />
{/each}
  </div>
  </body>

  <style>
    dl {
      display: grid;
      grid-template-columns: repeat(3, 1fr); /* 4 equal-sized columns */
  grid-template-rows: auto auto; /* 2 rows for <dt> and <dd> */
  gap: 1rem; /* Optional gap between grid items */
  background: oklch(50% 1% 200/ 40%);
       
    }


    dt {
  grid-column: span 1; /* Default behavior: place in first column */
  grid-row: 1; /* Place all <dt> elements in the first row */
    text-align: center;
}

dd {
  grid-column: span 1; /* Default behavior: place in first column */
  grid-row: 2; /* Place all <dd> elements in the second row */
    text-align: center;
}
  </style>

