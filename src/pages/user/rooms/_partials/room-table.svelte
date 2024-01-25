<script lang="ts">
  import type { Room } from '@/pages/api/room'

  import Pagination from '@/components/pagination.svelte'
  import AddRoom from './add-room.svelte'
  import RoomRow from './room-row.svelte'

  export let rooms: Room[]
  export let count: number
  export let currentPage: number
  export let perPage: number

  let roomList = [...rooms]
  let dialogOpen = false
</script>

<section class="bg-white px-6 py-4 rounded-md">
  <header class="grid md:grid-cols-[auto_1fr] items-center">
    <h2 class="font-semibold">Rooms</h2>

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
        <span>Add room</span>
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
          <th class="py-2.5 px-4 whitespace-nowrap">Floor</th>
          <th class="py-2.5 px-4 rounded-r-lg whitespace-nowrap">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each roomList as room (room.id)}
          <RoomRow
            {room}
            on:edit={(e) => {
              const idx = roomList.findIndex((o) => o.id === e.detail.id)
              const room = { ...roomList[idx], ...e.detail }
              roomList[idx] = room
            }}
            on:delete={(e) => {
              roomList = roomList.filter((o) => o.id !== e.detail)
            }}
          />
        {:else}
          <tr>
            <td
              colspan="6"
              class="text-sm text-center text-slate-500 italic py-2"
            >
              No room found
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  {#if !!roomList.length}
    <div class="my-4 sm:col-span-2 md:col-span-3">
      <Pagination {count} {perPage} {currentPage} />
    </div>
  {/if}
</section>

<AddRoom
  bind:dialogOpen
  on:submit={(e) => (roomList = [...roomList, e.detail])}
/>
