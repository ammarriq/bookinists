<script lang="ts">
  import type { Edition } from '@/pages/api/edition'

  import { fly } from 'svelte/transition'
  import { Select, Switch } from 'bits-ui'
  import { condition } from '@/lib/constants'
  import Field from '@/components/field.svelte'

  export let need_repair = false
  export let book_condition = ''
  export let book_condition_notes = ''
  export let jacket_condition = ''
  export let jacket_condition_notes = ''

  export let errors: Record<keyof Edition, string[]> | null = null
</script>

<div class="grid gap-y-4 pb-6 px-6 rounded-md bg-white mt-6">
  <h3 class="font-medium py-4 border-b">Condition</h3>

  <aside class="grid gap-4">
    <Field class="px-3 py-2 border rounded-md" error={errors?.need_repair}>
      <div class="flex items-center justify-between">
        <hgroup>
          <h2 class="text-sm font-medium">Repair</h2>
          <p class="text-sm text-slate-500/70">Should it be repaired?</p>
        </hgroup>

        <Switch.Root
          checked={need_repair}
          class="flex items-center w-[40px] h-[21px]
          rounded-full bg-slate-200 data-[checked]:bg-slate-900"
        >
          <Switch.Input class="peer" name="need_repair" />
          <i
            class="bg-white rounded-full duration-300 size-[17px]
            translate-x-[2px] peer-checked:translate-x-[20px]"
          />
        </Switch.Root>
      </div>
    </Field>

    <Field label="Book condition" error={errors?.book_condition}>
      <Select.Root
        portal="body"
        selected={condition.find((o) => o.value === book_condition)}
      >
        <Select.Trigger
          class="flex items-center justify-between border w-full px-3
          py-1.5 rounded-md text-sm  shadow-sm focus:outline-slate-900
          {errors?.book_condition ? 'border-red-500' : ''}"
          aria-label="Select option"
        >
          <Select.Value
            class="text-sm first-letter:capitalize"
            placeholder="Select option"
          />
          <Select.Input name="book_condition" />
          <i class="icon-[tabler--selector]" />
        </Select.Trigger>
        <Select.Content
          class="w-full rounded-md p-1 border bg-white  shadow-sm z-40"
          transition={(e) => fly(e, { duration: 150, y: -5 })}
          sideOffset={8}
        >
          {#each condition as { value, label } (value)}
            <Select.Item
              class="px-2 py-1 text-sm rounded-md cursor-default
              first-letter:capitalize hover:bg-slate-100"
              {value}
              {label}
            >
              {label}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </Field>

    <Field label="Book condition notes" error={errors?.book_condition_notes}>
      <textarea
        name="book_condition_notes"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900 h-24"
        value={book_condition_notes}
        class:border-red-500={errors?.book_condition_notes}
      />
    </Field>

    <Field label="Jacket condition" error={errors?.jacket_condition}>
      <Select.Root
        portal="body"
        selected={condition.find((o) => o.value === jacket_condition)}
      >
        <Select.Trigger
          class="flex items-center justify-between border w-full px-3
          py-1.5 rounded-md text-sm  shadow-sm focus:outline-slate-900
          {errors?.jacket_condition ? 'border-red-500' : ''}"
          aria-label="Select option"
        >
          <Select.Value
            class="text-sm first-letter:capitalize"
            placeholder="Select option"
          />
          <Select.Input name="jacket_condition" />
          <i class="icon-[tabler--selector]" />
        </Select.Trigger>
        <Select.Content
          class="w-full rounded-md p-1 border bg-white  shadow-sm z-40"
          transition={(e) => fly(e, { duration: 150, y: -5 })}
          sideOffset={8}
        >
          {#each condition as { value, label } (value)}
            <Select.Item
              class="px-2 py-1 text-sm rounded-md cursor-default
              first-letter:capitalize hover:bg-slate-100"
              {value}
              {label}
            >
              {label}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </Field>

    <Field
      label="Jacket condition notes"
      error={errors?.jacket_condition_notes}
    >
      <textarea
        name="jacket_condition_notes"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900 h-24"
        value={jacket_condition_notes}
        class:border-red-500={errors?.jacket_condition_notes}
      />
    </Field>
  </aside>
</div>
