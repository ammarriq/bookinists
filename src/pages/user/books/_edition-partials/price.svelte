<script lang="ts">
  import { fly } from 'svelte/transition'
  import { Select } from 'bits-ui'
  import { condition, lend_status as lendStatusList } from '@/lib/constants'
  import Field from '@/components/field.svelte'
  import dayjs from 'dayjs'

  export let buyer_id = ''
  export let seller_id = ''
  export let sell_price = 0
  export let sell_date = 0
  export let lender_id = ''
  export let lend_status = ''
  export let lend_date = 0
</script>

<div class="grid gap-y-4 pb-6 px-6 rounded-md bg-white mt-6">
  <h3 class="font-medium py-4 border-b">Price</h3>

  <aside class="grid md:grid-cols-2 gap-3">
    <Field label="Buyer">
      <Select.Root
        portal="body"
        selected={lendStatusList
          .map((o) => ({ value: o, label: o }))
          .find((o) => o.value === buyer_id)}
      >
        <Select.Trigger
          class="flex items-center justify-between border w-full px-3
          py-1.5 rounded-md text-sm  shadow-sm focus:outline-slate-900"
          aria-label="Select buyer"
        >
          <Select.Value
            class="text-sm first-letter:capitalize"
            placeholder="Select buyer"
          />
          <Select.Input name="buyer_id" />
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

    <Field label="Seller">
      <Select.Root
        portal="body"
        selected={lendStatusList
          .map((o) => ({ value: o, label: o }))
          .find((o) => o.value === seller_id)}
      >
        <Select.Trigger
          class="flex items-center justify-between border w-full px-3
          py-1.5 rounded-md text-sm  shadow-sm focus:outline-slate-900"
          aria-label="Select seller"
        >
          <Select.Value
            class="text-sm first-letter:capitalize"
            placeholder="Select seller"
          />
          <Select.Input name="seller_id" />
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

    <Field label="Sell price">
      <input
        type="number"
        name="sell_price"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={sell_price}
      />
    </Field>

    <Field label="Sell date">
      <input
        type="date"
        name="sell_date"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={dayjs(sell_date).format('YYYY-MM-DD')}
      />
    </Field>

    <Field label="Lender">
      <Select.Root
        portal="body"
        selected={lendStatusList
          .map((o) => ({ value: o, label: o }))
          .find((o) => o.value === lender_id)}
      >
        <Select.Trigger
          class="flex items-center justify-between border w-full px-3
          py-1.5 rounded-md text-sm  shadow-sm focus:outline-slate-900"
          aria-label="Select lender"
        >
          <Select.Value
            class="text-sm first-letter:capitalize"
            placeholder="Select lender"
          />
          <Select.Input name="lender_id" />
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

    <Field label="Lend status">
      <Select.Root
        portal="body"
        selected={lendStatusList
          .map((o) => ({ value: o, label: o }))
          .find((o) => o.value === lend_status)}
      >
        <Select.Trigger
          class="flex items-center justify-between border w-full px-3
          py-1.5 rounded-md text-sm  shadow-sm focus:outline-slate-900"
          aria-label="Select lend status"
        >
          <Select.Value
            class="text-sm first-letter:capitalize"
            placeholder="Select lend status"
          />
          <Select.Input name="lend_status" />
          <i class="icon-[tabler--selector]" />
        </Select.Trigger>
        <Select.Content
          class="w-full rounded-md p-1 border bg-white  shadow-sm z-40"
          transition={(e) => fly(e, { duration: 150, y: -5 })}
          sideOffset={8}
        >
          {#each lendStatusList as value (value)}
            {@const label = value.replaceAll('_', ' ')}
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

    <Field label="Lend date">
      <input
        type="date"
        name="lend_date"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={dayjs(lend_date).format('YYYY-MM-DD')}
      />
    </Field>
  </aside>
</div>
