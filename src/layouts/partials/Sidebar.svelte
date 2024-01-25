<script lang="ts">
  let isOpen = false
</script>

<button
  class="fixed top-3 left-4 flex items-center lg:hidden z-50"
  on:click={() => (isOpen = !isOpen)}
>
  <i class="icon-[tabler--menu] size-5" />
</button>

<aside
  class="fixed top-11 lg:top-0 bottom-0 -left-full lg:left-0 w-56 z-40
  grid grid-rows-[auto_1fr] px-1 py-4 duration-500 bg-[#0f172a]"
  class:!left-0={isOpen}
>
  <slot />
</aside>
