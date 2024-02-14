<script lang="ts">
  import type { Book } from '@/pages/api/book'

  import { Switch } from 'bits-ui'
  import Pagination from '@/components/pagination.svelte'
  import Button from '@/components/button.svelte'
  import AddBook from './add-book.svelte'
  import BookRow from './book-row.svelte'
  import SelectionActions from './selection-actions.svelte'

  export let books: Book[]
  export let count: number
  export let currentPage: number
  export let perPage: number

  let selectedBooks: string[] = []
  let bookList = [...books]
  let dialogOpen = false

  const selectAll = (isChecked: boolean) => {
    if (isChecked) {
      selectedBooks = bookList.map((book) => book.id)
    } else {
      selectedBooks = []
    }
  }

  const onChange = (id: string, isChecked: boolean) => {
    if (isChecked) {
      selectedBooks = [...selectedBooks, id]
    } else {
      selectedBooks = selectedBooks.filter((o) => o !== id)
    }
  }
</script>

<section class="bg-white px-6 py-4 rounded-md">
  <header class="flex items-center">
    <h2 class="font-semibold">Books</h2>

    <Button
      on:click={() => (dialogOpen = true)}
      class="px-3 py-1.5 text-white bg-slate-900 hover:bg-slate-900/90 ml-auto"
    >
      <i class="icon-[tabler--plus]" />
      <span>Create</span>
    </Button>
  </header>

  <header class="flex flex-wrap gap-4 items-stretch mt-4">
    <form class="relative w-full sm:max-w-sm">
      <i
        class="icon-[tabler--search] absolute
        top-1/2 -translate-y-1/2 left-2.5"
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

    <aside class="flex gap-2 ml-auto">
      <Button class="py-1.5 px-2">
        <i class="icon-[tabler--filter] size-4" />
      </Button>

      {#if selectedBooks.length}
        <SelectionActions />
      {/if}
    </aside>
  </header>

  <div class="mt-4 overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr
          class="text-left text-xxs tracking-wider
          uppercase text-slate-500/70 bg-slate-100"
        >
          <th class="py-2.5 px-4 rounded-l-lg whitespace-nowrap">
            <Switch.Root
              class="flex items-center justify-center
              border rounded-md shadow size-4 bg-white"
              onCheckedChange={selectAll}
              checked={bookList.every((o) => selectedBooks.includes(o.id))}
            >
              <Switch.Input class="peer" name="use_whatsapp" />
              <i
                class="icon-[tabler--square-rounded-check-filled] bg-black
                shrink-0 size-[1.125rem] hidden peer-checked:block"
              />
            </Switch.Root>
          </th>
          <th class="py-2.5 px-4 whitespace-nowrap">Title</th>
          <th class="py-2.5 px-4 whitespace-nowrap">URL</th>
          <th class="py-2.5 px-4 whitespace-nowrap">Read status</th>
          <th class="py-2.5 px-4 whitespace-nowrap">Rating</th>
          <th class="py-2.5 px-4 whitespace-nowrap">Review</th>
          <th class="py-2.5 px-4 rounded-r-lg whitespace-nowrap">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each bookList as book (book.id)}
          <BookRow
            {book}
            selected={selectedBooks.includes(book.id)}
            on:change={(e) => onChange(book.id, e.detail)}
            on:edit={(e) => {
              const bookIdx = bookList.findIndex((o) => o.id === e.detail.id)
              const book = { ...bookList[bookIdx], ...e.detail }
              bookList[bookIdx] = book
            }}
            on:delete={(e) => {
              bookList = bookList.filter((o) => o.id !== e.detail)
            }}
          />
        {:else}
          <tr>
            <td
              colspan="6"
              class="text-sm text-center text-slate-500 italic py-2"
            >
              No book found
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if !!bookList.length}
    <div class="my-4 sm:col-span-2 md:col-span-3">
      <Pagination {count} {perPage} {currentPage} />
    </div>
  {/if}
</section>

<AddBook
  bind:dialogOpen
  on:submit={(e) => (bookList = [...bookList, e.detail])}
/>
