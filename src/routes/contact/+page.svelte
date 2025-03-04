<svelte:head>
  <title>Contact me</title>
</svelte:head>


<h1>Get in touch!</h1>

    <form action="mailto:bsheres@mit.edu" method="POST" enctype="text/plain">
      <ul>
        <label class="red"
          >Email
          <input name="email" placeholder="Your email here" type="email" />
        </label>
        <label>Subject<input name="subject" placeholder="Subject" /></label>
        <label
          >Content<textarea name="body" placeholder="Body"></textarea>
        </label>
        <label>
          <button>Submit</button>
        </label>
      </ul>
    </form>