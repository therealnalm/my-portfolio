<script>
    export let data = {};
    export let hLevel = 2;
</script>

<article>
    <svelte:element this = {"h" + hLevel}>{data.title} <br> ({data.year})</svelte:element>
    <img
      src={data.image}
      alt=""
    />
    <p>
      {data.description}
    </p>
  </article>