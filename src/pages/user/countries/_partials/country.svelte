<script lang="ts">
  import type { Country as ICountry } from '@/pages/api/country'

  import { Avatar } from 'bits-ui'
  import CountryActions from './country-actions.svelte'

  export let country: ICountry

  let flag = ''

  const getFile = async (key: string) => {
    const res = await fetch(`/api/file?key=${key}`)

    const blob = new Blob([await res.arrayBuffer()])
    const url = URL.createObjectURL(blob)

    flag = url
  }

  $: if (typeof window !== 'undefined') {
    getFile(country.flag)
  }
</script>

<li class="text-sm bg-slate-100 rounded-md px-5 py-4 space-y-4">
  <header class="flex items-center justify-between">
    <div class="flex gap-2 items-center min-w-max">
      <Avatar.Root class="flex size-7 items-center justify-center rounded-full">
        <Avatar.Image src={flag} alt={country.name} />
        <Avatar.Fallback
          class="flex items-center justify-center
          bg-red-600 rounded-full size-7"
        >
          <i class="icon-[tabler--icons] size-5 text-white" />
        </Avatar.Fallback>
      </Avatar.Root>

      <p class="font-semibold text-slate-900">{country.name ?? ''}</p>
    </div>

    <div class="flex items-center">
      <CountryActions {country} on:delete on:edit />
    </div>
  </header>
</li>
