<script lang="ts">
  import type { AwardLinking as IBookAward } from '@/pages/api/award-linking'

  import EmptyPlaceholder from '@/components/empty-placeholder.svelte'
  import Pagination from '@/components/pagination.svelte'
  import AddBookAward from './add-book-award.svelte'
  import BookAward from './book-award.svelte'

  export let bookAwards: IBookAward[]
  export let count: number
  export let currentPage: number
  export let perPage: number

  let bookAwardsList = [...bookAwards]
  let dialogOpen = false
</script>

<section class="bg-white px-6 py-4 rounded-md">
  <header class="grid md:grid-cols-[auto_1fr] items-center">
    <h2 class="font-semibold">Book Awards</h2>

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
        px-4 py-1.5 border shadow-sm rounded-md
        whitespace-nowrap bg-white hover:bg-slate-50"
      >
        <i class="icon-[tabler--adjustments-alt]" />
        <span>Filters</span>
      </button>

      <button
        on:click={() => (dialogOpen = true)}
        class="flex items-center gap-1 text-sm text-white font-medium
        px-4 py-1.5 border shadow-sm rounded-md
        whitespace-nowrap bg-slate-900 hover:bg-slate-900/90"
      >
        <span>Add award</span>
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
          <th class="py-2.5 px-4 rounded-l-lg whitespace-nowrap">Book</th>
          <th class="py-2.5 px-4 whitespace-nowrap">Award</th>
          <th class="py-2.5 px-4 whitespace-nowrap">Award category</th>
          <th class="py-2.5 px-4 rounded-r-lg whitespace-nowrap">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each bookAwardsList as bookAward (bookAward.id)}
          <BookAward
            {bookAward}
            on:edit={(e) => {
              const idx = bookAwardsList.findIndex((o) => o.id === e.detail.id)
              const bookAwards = { ...bookAwardsList[idx], ...e.detail }
              bookAwardsList[idx] = bookAwards
            }}
            on:delete={(e) => {
              bookAwardsList = bookAwardsList.filter((o) => o.id !== e.detail)
            }}
          />
        {:else}
          <tr>
            <td
              colspan="4"
              class="text-sm text-center text-slate-500 italic py-2"
            >
              No award found
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    {#if !!bookAwardsList.length}
      <div class="my-4 sm:col-span-2 md:col-span-3">
        <Pagination {count} {perPage} {currentPage} />
      </div>
    {/if}
  </div>
</section>

<AddBookAward
  bind:dialogOpen
  on:submit={(e) => (bookAwardsList = [...bookAwardsList, e.detail])}
/>
