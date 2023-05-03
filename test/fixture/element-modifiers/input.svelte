<script>
  const onClick = () => {
    console.log("clicked");
  };
</script>

<button on:*|preventDefault|stopPropagation="{onClick}">Click Me</button>
