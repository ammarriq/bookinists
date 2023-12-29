<script>
  import { fly } from "svelte/transition";

  let clazz = "";
  export { clazz as class };

  let isOpen = false;
</script>

<div class="relative flex items-center {clazz}">
  <button on:click={() => (isOpen = !isOpen)}>
    <slot name="trigger" />
  </button>

  {#if isOpen}
    <div
      class="absolute top-full right-0"
      transition:fly={{ y: 10, duration: 200 }}
    >
      <slot name="content" />
    </div>
  {/if}
</div>
