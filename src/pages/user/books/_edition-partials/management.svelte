<script lang="ts">
  import { fly } from 'svelte/transition'
  import { Select } from 'bits-ui'
  import { binding, protection, status } from '@/lib/constants'
  import Field from '@/components/field.svelte'
</script>

<div class="grid gap-y-4 border-b pb-6 mt-6">
  <hgroup>
    <h3 class="font-semibold tracking-wider">Management</h3>
    <p class="text-slate-500/70 text-xs mt-1">
      Information related to managing the book
    </p>
  </hgroup>

  <aside class="grid md:grid-cols-2 gap-3">
    <Field label="Status">
      <Select.Root portal="body">
        <Select.Trigger
          class="flex items-center justify-between border w-full px-3
          py-1.5 rounded-md text-sm  shadow-sm focus:outline-slate-900"
          aria-label="Select a status"
        >
          <Select.Value
            class="text-sm first-letter:capitalize"
            placeholder="Select a status"
          />
          <Select.Input name="status" />
          <i class="icon-[tabler--selector]" />
        </Select.Trigger>
        <Select.Content
          class="w-full rounded-md p-1 border bg-white  shadow-sm z-40"
          transition={(e) => fly(e, { duration: 150, y: -5 })}
          sideOffset={8}
        >
          {#each status as item}
            <Select.Item
              class="px-2 py-1 text-sm capitalize rounded-md cursor-default hover:bg-slate-100"
              value={item}
              label={item}
            >
              {item}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </Field>

    <Field label="Protection">
      <Select.Root portal="body">
        <Select.Trigger
          class="flex items-center justify-between border w-full px-3
          py-1.5 rounded-md text-sm  shadow-sm focus:outline-slate-900"
          aria-label="Select a status"
        >
          <Select.Value
            class="text-sm first-letter:capitalize"
            placeholder="Select option"
          />
          <Select.Input name="protection" />
          <i class="icon-[tabler--selector]" />
        </Select.Trigger>
        <Select.Content
          class="w-full rounded-md p-1 border bg-white  shadow-sm z-40"
          transition={(e) => fly(e, { duration: 150, y: -5 })}
          sideOffset={8}
        >
          {#each protection as item}
            <Select.Item
              class="px-2 py-1 text-sm capitalize rounded-md cursor-default hover:bg-slate-100"
              value={item}
              label={item}
            >
              {item}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </Field>

    <Field label="Binding">
      <Select.Root portal="body">
        <Select.Trigger
          class="flex items-center justify-between border w-full px-3
          py-1.5 rounded-md text-sm  shadow-sm focus:outline-slate-900"
          aria-label="Select a status"
        >
          <Select.Value
            class="text-sm first-letter:capitalize"
            placeholder="Select option"
          />
          <Select.Input name="binding" />
          <i class="icon-[tabler--selector]" />
        </Select.Trigger>
        <Select.Content
          class="w-full rounded-md p-1 border bg-white  shadow-sm z-40"
          transition={(e) => fly(e, { duration: 150, y: -5 })}
          sideOffset={8}
        >
          {#each binding as item}
            <Select.Item
              class="px-2 py-1 text-sm capitalize rounded-md cursor-default hover:bg-slate-100"
              value={item}
              label={item}
            >
              {item}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </Field>
  </aside>
</div>
