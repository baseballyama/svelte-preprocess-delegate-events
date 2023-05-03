<script>
  const onClick = () => {
    console.log("clicked");
  };
</script>

<button on:*="{onClick}">Click Me</button>
