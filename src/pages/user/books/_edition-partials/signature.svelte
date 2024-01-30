<script lang="ts">
  import { fly } from 'svelte/transition'
  import { Select, Switch } from 'bits-ui'
  import { binding, protection, status } from '@/lib/constants'
  import Field from '@/components/field.svelte'
</script>

<div class="grid gap-y-4 border-b pb-6 mt-6">
  <hgroup>
    <h3 class="font-semibold tracking-wider">Printing</h3>
    <p class="text-slate-500/70 text-xs mt-1">
      Information related to book publishing and printing
    </p>
  </hgroup>

  <aside class="grid md:grid-cols-2 gap-3">
    <Field label="Edition">
      <input
        type="number"
        name="edition"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
      />
    </Field>

    <Field label="Total printed">
      <input
        type="number"
        name="total_printed"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
      />
    </Field>

    <Field label="Printing">
      <input
        type="number"
        name="printing"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
      />
    </Field>

    <Field class="col-span-2 px-3 py-2 border rounded-md">
      <div class="flex items-center justify-between">
        <hgroup>
          <h2 class="text-sm font-medium">Limited</h2>
          <p class="text-sm text-slate-500/70">Is the edition limited?</p>
        </hgroup>

        <Switch.Root
          class="flex items-center w-[40px] h-[21px]
          rounded-full bg-slate-200 data-[checked]:bg-slate-900"
        >
          <Switch.Input class="peer" name="use_whatsapp" />
          <i
            class="bg-white rounded-full duration-300 size-[17px]
            translate-x-[2px] peer-checked:translate-x-[20px]"
          />
        </Switch.Root>
      </div>
    </Field>

    <Field label="Limited number">
      <input
        type="number"
        name="limited_num"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
      />
    </Field>

    <Field label="Limited total">
      <input
        type="number"
        name="limited_total"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
      />
    </Field>

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
