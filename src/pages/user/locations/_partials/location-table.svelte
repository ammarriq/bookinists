<script lang="ts">
  import type { Location } from '@/pages/api/location'

  import Pagination from '@/components/pagination.svelte'
  import AddLocation from './add-location.svelte'
  import LocationRow from './location-row.svelte'

  export let locations: Location[]
  export let count: number
  export let currentPage: number
  export let perPage: number

  let locationList = [...locations]
  let dialogOpen = false
</script>

<section class="bg-white px-6 py-4 rounded-md">
  <header class="grid md:grid-cols-[auto_1fr] items-center">
    <h2 class="font-semibold">Locations</h2>

    <aside
      class="grid grid-cols-2 sm:grid-cols-[1fr_auto_auto] gap-2 md:ml-auto mt-2 md:mt-0"
    >
      <form class="relative grow min-w-full md:min-w-72 col-span-2 sm:col-auto">
        <i
          class="icon-[tabler--search] absolute top-1/2 -translate-y-1/2 left-2.5"
        />
        <input
          type="email"
          id="email"
          name="email"
          class="border w-full px-3 py-1.5 rounded-md text-sm
          shadow-sm focus:outline-slate-900 pl-8"
          placeholder="Search..."
        />
      </form>

      <button
        class="flex items-center gap-1 text-sm font-medium
        whitespace-nowrap bg-white hover:bg-slate-50
        px-4 py-1.5 border shadow-sm rounded-md"
      >
        <i class="icon-[tabler--adjustments-alt]" />
        <span>Filters</span>
      </button>

      <button
        on:click={() => (dialogOpen = true)}
        class="flex items-center gap-1 text-sm text-white font-medium
        whitespace-nowrap bg-slate-900 hover:bg-slate-900/90
        px-4 py-1.5 border shadow-sm rounded-md"
      >
        <span>Add location</span>
      </button>
    </aside>
  </header>

  <div class="mt-4 overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr
          class="text-left text-xxs tracking-wider
          uppercase text-slate-500/70 bg-slate-100"
        >
          <th class="py-2.5 px-4 rounded-l-lg whitespace-nowrap">Name</th>
          <th class="py-2.5 px-4 whitespace-nowrap">Address</th>
          <th class="py-2.5 px-4 whitespace-nowrap">Phone</th>
          <th class="py-2.5 px-4 whitespace-nowrap">Notes</th>
          <th class="py-2.5 px-4 rounded-r-lg whitespace-nowrap">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each locationList as location (location.id)}
          <LocationRow
            {location}
            on:edit={(e) => {
              const idx = locationList.findIndex((o) => o.id === e.detail.id)
              const location = { ...locationList[idx], ...e.detail }
              locationList[idx] = location
            }}
            on:delete={(e) => {
              locationList = locationList.filter((o) => o.id !== e.detail)
            }}
          />
        {:else}
          <tr>
            <td
              colspan="6"
              class="text-sm text-center text-slate-500 italic py-2"
            >
              No location found
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  {#if !!locationList.length}
    <div class="my-4 sm:col-span-2 md:col-span-3">
      <Pagination {count} {perPage} {currentPage} />
    </div>
  {/if}
</section>

<AddLocation
  bind:dialogOpen
  on:submit={(e) => (locationList = [...locationList, e.detail])}
/>
