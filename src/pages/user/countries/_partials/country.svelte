<script lang="ts">
  import type { Country as ICountry } from '@/pages/api/country'

  import CountryActions from './country-actions.svelte'
  import Image from '@/components/image.svelte'

  export let country: ICountry
</script>

<li class="text-sm bg-slate-100 rounded-md px-5 py-4 space-y-4">
  <header class="flex items-center justify-between">
    <div class="flex gap-2 items-center min-w-max">
      <Image
        class="flex size-7 items-center justify-center rounded-full"
        src={country.flag}
        alt={country.name}
      >
        <div
          slot="fallback"
          class="flex items-center justify-center
          bg-red-600 rounded-full size-7"
        >
          <i class="icon-[tabler--icons] size-5 text-white" />
        </div>
      </Image>

      <p class="font-semibold text-slate-900">{country.name ?? ''}</p>
    </div>

    <div class="flex items-center">
      <CountryActions {country} on:delete on:edit />
    </div>
  </header>
</li>
