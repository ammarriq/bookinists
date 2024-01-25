<script lang="ts">
  import type { Publisher as IPublisher } from '@/pages/api/publisher'

  import EmptyPlaceholder from '@/components/empty-placeholder.svelte'
  import Pagination from '@/components/pagination.svelte'
  import AddPubliher from './add-publisher.svelte'
  import Publisher from './publisher.svelte'

  export let publishers: IPublisher[]
  export let count: number
  export let currentPage: number
  export let perPage: number

  let publisherList = [...publishers]
  let dialogOpen = false
</script>

<section class="bg-white px-6 py-4 rounded-md">
  <header class="grid md:grid-cols-[auto_1fr] items-center">
    <h2 class="font-semibold">Publishers</h2>

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
        <span>Add Publisher</span>
      </button>
    </aside>
  </header>

  <ul class="mt-4 overflow-x-auto grid sm:grid-cols-2 md:grid-cols-3 gap-2">
    {#each publisherList as publisher (publisher.id)}
      <Publisher
        {publisher}
        on:edit={(e) => {
          const pubIdx = publisherList.findIndex((o) => o.id === e.detail.id)
          const publisher = { ...publisherList[pubIdx], ...e.detail }
          publisherList[pubIdx] = publisher
        }}
        on:delete={(e) => {
          publisherList = publisherList.filter((o) => o.id !== e.detail)
        }}
      />
    {:else}
      <EmptyPlaceholder
        label="publisher"
        icon="icon-[tabler--file-text]"
        on:click={() => (dialogOpen = true)}
      />
    {/each}

    {#if !!publisherList.length}
      <div class="my-4 sm:col-span-2 md:col-span-3">
        <Pagination {count} {perPage} {currentPage} />
      </div>
    {/if}
  </ul>
</section>

<AddPubliher
  bind:dialogOpen
  on:submit={(e) => (publisherList = [...publisherList, e.detail])}
/>
