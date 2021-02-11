<script>
  import successkid from 'images/successkid.jpg'
  console.log(process.env.API_KEY)
</script>

<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

<h1 class="text-blue-700">Great success!</h1>

<figure>
  <img alt="Success Kid" src={successkid} />
  <figcaption>Have fun with Sapper!</figcaption>
</figure>

<p><strong>Try editing this file (src/routes/index.svelte) to test live reloading.</strong></p>
