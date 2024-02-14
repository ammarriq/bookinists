<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'

  type $$Props = HTMLInputAttributes

  export let name: $$Props['name'] = ''
  export let value: $$Props['value'] = ''

  $: dateInSeconds = new Date(value).getTime()
</script>

<input type="hidden" {name} value={isNaN(dateInSeconds) ? 0 : dateInSeconds} />

<input
  {...$$restProps}
  type="date"
  {value}
  on:input={(e) => (value = e.currentTarget.value)}
/>
