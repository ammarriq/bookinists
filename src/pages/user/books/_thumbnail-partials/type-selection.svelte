<script lang="ts">
  import { fly } from 'svelte/transition'
  import { Select } from 'bits-ui'
  import { thumbnail_type } from '@/lib/constants'

  export let name: string
  export let error = ''
</script>

<Select.Root portal=".dialog">
  <Select.Trigger
    class="flex items-center justify-between border w-full px-3
    py-1.5 rounded-md text-sm shadow-sm focus:outline-slate-900
    {error ? 'border-red-500' : ''}"
    aria-label="Select type"
  >
    <Select.Value
      class="text-sm first-letter:capitalize"
      placeholder="Select type"
    />
    <Select.Input {name} />
    <i class="icon-[tabler--selector]" />
  </Select.Trigger>
  <Select.Content
    class="w-full rounded-md p-1 border bg-white  shadow-sm z-40"
    transition={(e) => fly(e, { duration: 150, y: -5 })}
    sideOffset={8}
  >
    {#each thumbnail_type as type}
      <Select.Item
        class="px-2 py-1 text-sm capitalize rounded-md cursor-default hover:bg-slate-100"
        value={type}
        label={type}
      >
        {type}
      </Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
