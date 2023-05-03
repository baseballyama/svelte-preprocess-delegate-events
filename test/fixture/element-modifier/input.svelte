<script>
  const onClick = () => {
    console.log("clicked");
  };
</script>

<button on:*|preventDefault="{onClick}">Click Me</button>
