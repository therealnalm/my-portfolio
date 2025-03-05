<script>
  import Project from "$lib/Project.svelte";
  import projects from "$lib/projects.json";
</script>  
  
  <body>
    <h1>Benjamin Sheres</h1>
    <p>Ben is a student at MIT currently enrolled in 6.C35</p>
    <img src="images/MG_2664.jpg" alt="Ben in Tux" />

    <h2>Latest Projects:</h2>
    <div class="projects">
    {#each projects.slice(0, 3) as p}
<Project data={p} hLevel = 3 />
{/each}
  </div>


  </body>

