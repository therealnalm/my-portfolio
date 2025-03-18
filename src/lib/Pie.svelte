Pie go here
<script>
    import * as d3 from "d3";

    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let arc = arcGenerator({
        startAngle: 0,
        endAngle: 2 * Math.PI
    })
    export let data = [];
    export let selectedIndex = -1;
    let colors = d3.scaleOrdinal(d3.schemeTableau10);
    let sliceGenerator = d3.pie().value(d=>d.value);
    let arcData;
    let arcs;
    $: {
        arcData = sliceGenerator(data);
        arcs = arcData.map(d=> arcGenerator(d));
    }

</script>
<div class="container">

<svg viewBox="-50 -50 100 100">
    {#each arcs as arc, index}
	<path d={arc} fill={ colors(index) }
          class:selected={selectedIndex === index}
	      on:click={e => selectedIndex = selectedIndex === index ? -1 : index}
 />
{/each}

</svg>

<ul class="legend">
	{#each data as d, index}
		<li style="--color: { colors(index) }" class:selected={selectedIndex === index}>
			<span class="swatch"></span>
			{d.label} <em>({d.value})</em>
		</li>
	{/each}
</ul>
</div>


<style>


.selected {
	--color: oklch(60% 45% 0) !important;
	
	&:is(path) {
		fill: var(--color) !important;
	}
	
	&:is(li) {
		color: var(--color);
	}
}

.legend:has(.selected) li:not(.selected) {
	color: gray;
}

.legend li.selected{
    font-weight: bold;
}


path:hover {
	opacity: 100% !important;
}



svg:has(path:hover) path:not(:hover) {
	opacity: 50%;
}

svg:has(path.selected) path:not(.selected) {
	opacity: 50%;
}

path{
    transition: 300ms;
    cursor: pointer;
}

      .legend{
        border: 1px solid black;
        flex: 1;
    }
    svg{
        max-width: 20em;
        margin-block: 2em;
        overflow:visible;
    }

    .swatch{
        display: inline-flex;
        background-color: var(--color);
        width: 1em;
        height: 1em;
    }

    ul{
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(8em, 1fr));
    }

    li{
        display: flex;
        align-items: center;
        /* gap: 1em; */
    }

    .container{
        display: flex;
    }
  
</style>;