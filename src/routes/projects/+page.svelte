<script>
  import Project from "$lib/Project.svelte";
  import projects from "$lib/projects.json";
</script>

<svelte:head>
  <title>Projects</title>
</svelte:head>


<h1>Ben's {projects.length} Projects</h1>
<div class="projects">
  {#each projects as p}
  <Project data = {p}/>
  {/each}
  
</div>