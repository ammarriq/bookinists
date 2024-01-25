<script lang="ts">
  import { slide } from 'svelte/transition'

  type $$Props = {
    active: boolean
    href?: string
    isOpen?: boolean
  }

  export let active: $$Props['active']
  export let href: $$Props['href'] = ''
  export let isOpen: $$Props['isOpen'] = false
</script>

{#if href}
  <a
    {href}
    class={`flex items-center gap-2 py-1 rounded-md
    ${active ? 'text-amber-300' : 'text-gray-400'}`}
  >
    <slot />
  </a>
{:else}
  <div class="grid">
    <button class="w-full" on:click={() => (isOpen = !isOpen)}>
      <div
        class={`flex items-center gap-2 py-1 rounded-md
        ${active ? 'text-white' : 'text-gray-400'}`}
      >
        <slot />

        <i
          class="icon-[tabler--chevron-down] ml-auto duration-200"
          class:rotate-180={isOpen}
        />
      </div>
    </button>

    {#if isOpen}
      <div class="py-1 pl-6" transition:slide={{ duration: 200, axis: 'y' }}>
        <slot name="submenu" />
      </div>
    {/if}
  </div>
{/if}
