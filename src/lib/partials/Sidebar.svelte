<script lang="ts">
  let isOpen = false
</script>

<button
  class="fixed top-3 left-4 flex items-center lg:hidden"
  on:click={() => (isOpen = !isOpen)}
>
  <i class="icon-[tabler--menu] size-5" />
</button>

<aside
  class="fixed top-11 lg:top-0 bottom-0 -left-full lg:left-0
  bg-white p-4 w-56 duration-500"
  class:!left-0={isOpen}
>
  <slot />
</aside>
