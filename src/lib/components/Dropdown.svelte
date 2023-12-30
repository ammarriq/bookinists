<script lang="ts">
  import { fly } from 'svelte/transition'

  let clazz = ''
  export { clazz as class }

  let isOpen = false

  const hide = () => (isOpen = false)
  const clickOutside = (node: HTMLElement, handler: () => void) => {
    const listener = (event: MouseEvent) => {
      if (node && !node.contains(event.target as HTMLElement)) handler()
    }

    document.addEventListener('click', listener)

    return {
      destroy: () => document.removeEventListener('click', listener),
    }
  }
</script>

<div class="relative flex items-center {clazz}">
  <button on:click|stopPropagation={() => (isOpen = !isOpen)}>
    <slot name="trigger" />
  </button>

  {#if isOpen}
    <div
      class="absolute top-full right-0"
      transition:fly={{ y: 10, duration: 150 }}
      use:clickOutside={hide}
    >
      <slot name="content" {hide} />
    </div>
  {/if}
</div>
