<script lang="ts">
  let clazz = ''
  export { clazz as class }
</script>

<button
  class="flex items-center justify-center gap-2 whitespace-nowrap
  text-sm font-medium border shadow-sm rounded-md {clazz}"
  on:click
>
  <slot />
</button>
