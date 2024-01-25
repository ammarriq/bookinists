<script lang="ts">
  import type { Location } from '@/pages/api/location'

  import LocationActions from './location-actions.svelte'

  export let location: Location
</script>

<tr class="text-sm border-b">
  <td class="py-2.5 px-4 whitespace-nowrap">
    <p class="font-semibold text-slate-900">{location.name ?? ''}</p>
    <a
      href={location.url}
      target="_blank"
      class="text-slate-500/70 hover:underline"
    >
      {location.url}
    </a>
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap capitalize">
    {location.address}
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap">
    {location.phone}
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap">
    {location.notes}
  </td>
  <td class="py-2.5 px-4 text-right whitespace-nowrap">
    <LocationActions {location} on:delete on:edit />
  </td>
</tr>
