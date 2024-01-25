<script lang="ts">
  import type { Book } from '@/pages/api/book'

  import { Avatar } from 'bits-ui'
  import { stars } from '@/lib/utils'
  import BookActions from '../_book-partials/book-actions.svelte'

  export let book: Book

  const status = {
    unread: 'bg-red-500/20 text-red-500',
    reading: 'bg-yellow-500/20 text-yellow-500',
    read: 'bg-green-500/20 text-green-500',
  }
</script>

<tr class="text-sm border-b">
  <td class="py-2.5 px-4 whitespace-nowrap">
    <a href="/user/books/{book.id}" class="flex gap-2 items-center min-w-max">
      <Avatar.Root class="flex width-8 items-center justify-center">
        <Avatar.Image src={book.url} alt="@huntabyte" />
        <Avatar.Fallback class="flex items-center justify-center width-8">
          <i class="icon-[tabler--book] size-6" />
        </Avatar.Fallback>
      </Avatar.Root>
      <div>
        <p class="text-slate-900 font-medium">
          {book.title ?? ''}
        </p>
      </div>
    </a>
  </td>

  <td class="py-2.5 px-4 whitespace-nowrap">
    <a href={book.url} class="underline" target="_blank"> Go to book </a>
  </td>

  <td class="py-2.5 px-4 whitespace-nowrap">
    <span class="block px-2 rounded-full max-w-max {status[book.read_status]}">
      {book.read_status}
    </span>
  </td>

  <td class="py-2.5 px-4 whitespace-nowrap">
    <div class="space-x-1">
      {#each stars(3.5) as star, i (i)}
        <i
          class="text-orange-500 size-4"
          class:icon-[tabler--star-filled]={star === 'full'}
          class:icon-[tabler--star-half-filled]={star === 'half'}
          class:icon-[tabler--star]={star === 'empty'}
        />
      {/each}
    </div>
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap">
    {book.review}
  </td>
  <td class="py-2.5 px-4 text-right whitespace-nowrap">
    <BookActions {book} on:delete on:edit />
  </td>
</tr>
