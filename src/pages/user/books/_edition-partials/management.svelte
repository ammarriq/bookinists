<script lang="ts">
  import { fly } from 'svelte/transition'
  import { Select } from 'bits-ui'
  import {
    binding as bindingList,
    protection as protectionList,
    status as statusList,
  } from '@/lib/constants'
  import Field from '@/components/field.svelte'

  export let status = ''
  export let protection = ''
  export let binding = ''
</script>

<div class="grid gap-y-4 pb-6 px-6 rounded-md bg-white mt-6">
  <h3 class="font-medium py-4 border-b">Management</h3>

  <aside class="grid md:grid-cols-2 gap-3">
    <Field label="Status">
      <Select.Root
        portal="body"
        selected={statusList
          .map((o) => ({ value: o, label: o }))
          .find((o) => o.value === status)}
      >
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
          {#each statusList as item}
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
      <Select.Root
        portal="body"
        selected={protectionList
          .map((o) => ({ value: o, label: o }))
          .find((o) => o.value === protection)}
      >
        <Select.Trigger
          class="flex items-center justify-between border w-full px-3
          py-1.5 rounded-md text-sm  shadow-sm focus:outline-slate-900"
          aria-label="Select option"
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
          {#each protectionList as item}
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
      <Select.Root
        portal="body"
        selected={bindingList
          .map((o) => ({ value: o, label: o }))
          .find((o) => o.value === binding)}
      >
        <Select.Trigger
          class="flex items-center justify-between border w-full px-3
          py-1.5 rounded-md text-sm  shadow-sm focus:outline-slate-900"
          aria-label="Select option"
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
          {#each bindingList as item}
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
