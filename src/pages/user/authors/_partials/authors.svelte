<script lang="ts">
  import type { Author as IAuthor } from '@/pages/api/author'

  import EmptyPlaceholder from '@/components/empty-placeholder.svelte'
  import Pagination from '@/components/pagination.svelte'
  import AddAuthor from './add-author.svelte'
  import Author from './author.svelte'

  export let authors: IAuthor[]
  export let count: number
  export let currentPage: number
  export let perPage: number

  let authorList = [...authors]
  let dialogOpen = false
</script>

<section class="bg-white px-6 py-4 rounded-md">
  <header class="grid md:grid-cols-[auto_1fr] items-center">
    <h2 class="font-semibold">Authors</h2>

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
        <span>Add author</span>
      </button>
    </aside>
  </header>

  <ul class="mt-4 overflow-x-auto grid sm:grid-cols-2 md:grid-cols-3 gap-2">
    {#each authorList as author (author.id)}
      <Author
        {author}
        on:edit={(e) => {
          const authorIdx = authorList.findIndex((o) => o.id === e.detail.id)
          const author = { ...authorList[authorIdx], ...e.detail }
          authorList[authorIdx] = author
        }}
        on:delete={(e) => {
          authorList = authorList.filter((o) => o.id !== e.detail)
        }}
      />
    {:else}
      <EmptyPlaceholder
        label="author"
        icon="icon-[tabler--feather]"
        on:click={() => (dialogOpen = true)}
      />
    {/each}

    {#if !!authorList.length}
      <div class="my-4 sm:col-span-2 md:col-span-3">
        <Pagination {count} {perPage} {currentPage} />
      </div>
    {/if}
  </ul>
</section>

<AddAuthor
  bind:dialogOpen
  on:submit={(e) => (authorList = [...authorList, e.detail])}
/>
