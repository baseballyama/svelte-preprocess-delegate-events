<script>
  const onClick = () => {
    console.log("clicked");
  };
</script>

<button on:click={onClick} on:blur={onClick}>Click Me</button>
