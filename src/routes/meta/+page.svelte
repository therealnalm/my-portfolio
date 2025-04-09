<script>
    import * as d3 from "d3";
    import {onMount} from "svelte";
    import {computePosition, autoPlacement, offset,} from '@floating-ui/dom';
    import Bar from '$lib/Bar.svelte';

    
    let data = [];
    let commits = [];
    let files = [];
    let clickedCommits = [];
    let width = 1000, height = 600;
    let xAxis, yAxis;
    let yAxisGridlines;
    let cursor  = {x:0, y:0};
    let commitToolTip;
    let toolTipPosition = {x:0, y:0};
    $: allTypes = Array.from(new Set(data.map(d => d.type)));
    $: selectedLines = (clickedCommits.length > 0 ? clickedCommits : commits).flatMap(d => d.lines);
    $: selectedCounts = d3.rollup(
    selectedLines,
    v => v.length,
    d => d.type
    );
    $: languageBreakdown = allTypes.map(type => [type, selectedCounts.get(type) || 0]);





    $: hoveredIndex = -1;
    $: hoveredCommit = commits[hoveredIndex] ?? hoveredCommit ?? {};

    // d3.select(yAxis).call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, "0") + ":00"));
    $: {
        d3.select(yAxisGridlines).call(
            d3.axisLeft(yScale)
            .tickFormat("")
            .tickSize(-usableArea.width)
        );
    }


    onMount(async () => {
            data = await d3.csv("/loc.csv", row => ({
        ...row,
        line: Number(row.line), // or just +row.line
        depth: Number(row.depth),
        length: Number(row.length),
        date: new Date(row.date + "T00:00" + row.timezone),
        datetime: new Date(row.datetime)
        }));
    
        commits = d3.groups(data, d => d.commit).map(([commit, lines]) => {
            let first = lines[0];
            let {author, date, time, timezone, datetime} = first;
            let ret = {
                id: commit,
                url: "https://github.com/vis-society/lab-7/commit/" + commit,
                author, date, time, timezone, datetime,
                hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
                totalLines: lines.length
            };

            // Like ret.lines = lines
            // but non-enumerable so it doesn’t show up in JSON.stringify
            Object.defineProperty(ret, "lines", {
                value: lines,
                configurable: true,
                writable: true,
                enumerable: false,
            });

            return ret;
        });

        files = d3.groups(data, d=> d.file);

        console.log(data);
        console.log(commits);
        console.log(files)
    });

    async function dotInteraction (index, evt) {
        let hoveredDot = evt.target;
        if (evt.type === "mouseenter") {
            hoveredIndex = index;
            cursor = {x: evt.x, y: evt.y};
            toolTipPosition = await computePosition(hoveredDot, commitToolTip, {
                strategy: "fixed", // because we use position: fixed
                middleware: [
                    offset(5), // spacing from tooltip to dot
                    autoPlacement() // see https://floating-ui.com/docs/autoplacement
                ],
            });        }
        else if (evt.type === "mouseleave") {
            hoveredIndex = -1
        }
        else if (evt.type === "click"){
            let commit = commits[index];
            if (!clickedCommits.includes(commit)){
                clickedCommits = [...clickedCommits, commit];
            }else{
                clickedCommits = clickedCommits.filter(c=> c !== commit);
            }
        }
}



    let margin = {top: 10, right: 10, bottom: 30, left: 20};
    let usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left
    };
    usableArea.width = usableArea.right - usableArea.left;
    usableArea.height = usableArea.bottom - usableArea.top;
    $: minDate = d3.min(commits.map(d => d.date));
    $: maxDate = d3.max(commits.map(d => d.date));
    $: maxDatePlusOne = new Date(maxDate);
    $: maxDatePlusOne.setDate(maxDatePlusOne.getDate() + 1);

    $: xScale = d3.scaleTime()
                .domain([minDate, maxDatePlusOne])
                .range([usableArea.left, usableArea.right])
                .nice();

    $: yScale = d3.scaleLinear()
                .domain([24, 0])
                .range([usableArea.bottom, usableArea.top]);
    $: {
	    d3.select(xAxis).call(d3.axisBottom(xScale));
	    d3.select(yAxis).call(d3.axisLeft(yScale));
    }
    


</script>

<svelte:head>
  <title>Meta</title>
</svelte:head>

<section>

    <h2> Some meta statistics</h2>
    <dl class="stats">
        <dt>Total <abbr title="Lines of code">LOC</abbr></dt>
        <dd>{data.length}</dd>
        <dt>Total Commits </dt>
        <dd>{commits.length}</dd>
        <dt>Total number of files</dt>
        <dd>{files.length}</dd>
    </dl>
 
    
</section>

<dl class="info tooltip" bind:this={commitToolTip} hidden = { hoveredIndex=== -1} style="top: {toolTipPosition.y}px; left: {toolTipPosition.x}px">
    <dt>Commit</dt>
    <dd><a href="{ hoveredCommit.url }" target="_blank">{ hoveredCommit.id }</a></dd>

    <dt>Date</dt>
    <dd>{ hoveredCommit.datetime?.toLocaleString("en", {dateStyle: "full"}) }</dd>

    <dt>Time</dt>
    <dd>{ hoveredCommit.time?.toLocaleString("en", {dateStyle: "full"}) }</dd>

    <dt>Author</dt>
    <dd>{ hoveredCommit.author?.toLocaleString("en", {dateStyle: "full"}) }</dd>

    <dt>Lines Edited</dt>
    <dd>{ hoveredCommit.lines?.length.toLocaleString("en", {dateStyle: "full"}) }</dd>

    <!-- Add: Time, author, lines edited -->
</dl>

<svg viewBox="0 0 {width} {height}">
	<g class="dots">
    <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
    <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />

        {#each commits as commit, index }
            <circle
                class:selected={clickedCommits.includes(commit)}
                cx={ xScale(commit.datetime) }
                cy={ yScale(commit.hourFrac) }
                r="5"
                fill="steelblue"
                on:mouseenter={evt => dotInteraction(index, evt)}
	            on:mouseleave={evt => dotInteraction(index, evt)}
                on:click ={evt => dotInteraction(index, evt)}
            />
        {/each}
        </g>
    <g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this={yAxisGridlines} />
      
</svg>

<Bar data={languageBreakdown} width={width} />


{JSON.stringify(clickedCommits)}



<style lang="scss" >

    .selected{
        fill:var(--color-accent)
    }

    .gridlines {
        stroke-opacity: .1;
    }


    svg {
		overflow: visible;
	}

    dl.info{
        display: grid;
        transition-duration: 500ms;
        transition-property: opacity, visibility;

        &[hidden]:not(:hover, :focus-within) {
	    	opacity: 0;
		    visibility: hidden;
	}



    }
    
    dl.info dt {
            grid-column: 1;
            grid-row: span 1;
        }

    dl.info dd {
            grid-column: 2;
            grid-row: span 1;
        }

    .tooltip{
        position: fixed;
        background-color: oklch(95% 0% 0 / 80%);
        box-shadow: 10px 5px 5px gray;
        border-radius: 5px;
        padding: 1em;

    }

    circle {
	transition: 200ms;
    transform-origin: center;
    transform-box: fill-box;



	&:hover {
		transform: scale(1.5);
	}
}


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