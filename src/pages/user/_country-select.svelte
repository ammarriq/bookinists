<script lang="ts">
  import type { Country } from '@/pages/api/country'

  import { fly } from 'svelte/transition'
  import { Select } from 'bits-ui'

  export let country_id = ''
  export let error: string[] = []

  const getCountries = async () => {
    const res = await fetch('/api/country')
    const json = (await res.json()) as FetchResponse<Country[]>

    if (!json.success) {
      throw new Error('Something went wrong. Try again later.')
    }

    return json.data
  }
</script>

{#await getCountries()}
  <div
    class="flex items-center justify-between border w-full px-3
    py-1.5 rounded-md text-sm shadow-sm focus:outline-slate-900
    {!!error?.length ? 'border-red-500' : ''}"
    aria-label="Select a country"
  >
    <p class="text-sm flex items-center gap-2">
      <i class="icon-[tabler--loader-2] animate-spin duration-300" />
      <span class="italic capitalize">fetching...</span>
    </p>

    <i class="icon-[tabler--selector]" />
  </div>
{:then data}
  {@const countries = data.map((o) => ({ value: o.id, label: o.name }))}
  <Select.Root
    portal=".dialog"
    selected={countries.find((o) => o.value === country_id)}
  >
    <Select.Trigger
      class="flex items-center justify-between border w-full px-3
      py-1.5 rounded-md text-sm shadow-sm focus:outline-slate-900
      {!!error?.length ? 'border-red-500' : ''}"
      aria-label="Select a country"
    >
      <Select.Value
        class="text-sm first-letter:capitalize"
        placeholder="Select a country"
      />
      <Select.Input name="country_id" />
      <i class="icon-[tabler--selector]" />
    </Select.Trigger>

    <Select.Content
      class="w-full rounded-md p-1 border bg-white shadow-sm z-40"
      transition={(e) => fly(e, { duration: 150, y: -5 })}
      sideOffset={8}
    >
      {#each countries as country (country.value)}
        <Select.Item
          class="px-2 py-1 text-sm capitalize rounded-md
          cursor-default hover:bg-slate-100"
          value={country.value}
          label={country.label}
        >
          {country.label}
        </Select.Item>
      {:else}
        <p class="text-xs text-center py-1">
          <span class="italic capitalize text-slate-500">no country</span>
        </p>
      {/each}
    </Select.Content>
  </Select.Root>
{:catch}
  <div
    class="flex items-center justify-between border w-full px-3 py-1.5
    rounded-md text-sm shadow-sm focus:outline-slate-900 border-red-500"
    aria-label="Select a country"
  >
    <p class="text-sm flex items-center gap-2 text-red-500">
      <i class="icon-[tabler--alert-triangle]" />
      <span class="italic capitalize">Failed to load.</span>
    </p>

    <i class="icon-[tabler--selector]" />
  </div>
{/await}
