<script lang="ts">
  import { fly } from 'svelte/transition'
  import { Select, Switch } from 'bits-ui'
  import { signature_type as signatureList } from '@/lib/constants'
  import Field from '@/components/field.svelte'

  export let is_signed = false
  export let signature_type = ''
  export let signature_page = 0
</script>

<div class="grid gap-y-4 pb-6 px-6 rounded-md bg-white mt-6">
  <h3 class="font-medium py-4 border-b">Signature</h3>

  <aside class="grid md:grid-cols-2 gap-3">
    <Field class="col-span-2 px-3 py-2 border rounded-md">
      <div class="flex items-center justify-between">
        <hgroup>
          <h2 class="text-sm font-medium">Signature</h2>
          <p class="text-sm text-slate-500/70">Is the edition signatured?</p>
        </hgroup>

        <Switch.Root
          checked={is_signed}
          class="flex items-center w-[40px] h-[21px]
          rounded-full bg-slate-200 data-[checked]:bg-slate-900"
        >
          <Switch.Input class="peer" name="is_signature" />
          <i
            class="bg-white rounded-full duration-300 size-[17px]
            translate-x-[2px] peer-checked:translate-x-[20px]"
          />
        </Switch.Root>
      </div>
    </Field>

    <Field label="Signature type">
      <Select.Root
        portal="body"
        selected={signatureList
          .map((o) => ({ value: o, label: o }))
          .find((o) => o.value === signature_type)}
      >
        <Select.Trigger
          class="flex items-center justify-between border w-full px-3
          py-1.5 rounded-md text-sm  shadow-sm focus:outline-slate-900"
          aria-label="Select a signature"
        >
          <Select.Value
            class="text-sm first-letter:capitalize"
            placeholder="Select a signature"
          />
          <Select.Input name="signature_type" />
          <i class="icon-[tabler--selector]" />
        </Select.Trigger>
        <Select.Content
          class="w-full rounded-md p-1 border bg-white  shadow-sm z-40"
          transition={(e) => fly(e, { duration: 150, y: -5 })}
          sideOffset={8}
        >
          {#each signatureList as item}
            {@const label = item.replaceAll('_', ' ')}
            <Select.Item
              class="px-2 py-1 text-sm rounded-md cursor-default
              first-letter:capitalize hover:bg-slate-100"
              value={item}
              {label}
            >
              {label}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </Field>

    <Field label="Signature page">
      <input
        type="number"
        name="signature_page"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={signature_page}
      />
    </Field>
  </aside>
</div>
