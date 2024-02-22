<script lang="ts">
  import type { Action } from 'svelte/action'
  import type { HTMLAttributes } from 'svelte/elements'

  type $$Props = HTMLAttributes<HTMLButtonElement> & { use?: Action }

  let clazz: $$Props['class'] = ''
  export { clazz as class }
  export let use: $$Props['use'] = () => {}

  const action = !!use ? use : () => {}
</script>

<button
  {...$$restProps}
  use:action
  class="flex items-center justify-center gap-2 whitespace-nowrap
  text-sm font-medium border shadow-sm rounded-md {clazz}"
  on:click
>
  <slot />
</button>
