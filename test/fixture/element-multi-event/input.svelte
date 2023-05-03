<script>
  const onClick = () => {
    console.log("clicked");
  };
</script>

<button on:click,blur="{onClick}">Click Me</button>
