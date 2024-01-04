<script lang="ts">
  import type { User } from '@/lib/auth'

  import { Avatar } from 'bits-ui'
  import dayjs from 'dayjs'
  import BookActions from './_book-actions.svelte'

  export let book: User

  const networks: Record<string, string> = {
    google: '/icons/google.svg',
  }
</script>

<tr class="text-sm border-b">
  <td class="py-2.5 px-4 whitespace-nowrap">
    <div class="flex gap-2 items-center min-w-max">
      <Avatar.Root class="flex size-8 items-center justify-center rounded-full">
        <Avatar.Image src={book.picture} alt="@huntabyte" />
        <Avatar.Fallback
          class="flex items-center justify-center
          bg-red-600 rounded-full size-8"
        >
          <i class="icon-[tabler--user-filled] size-6 text-white" />
        </Avatar.Fallback>
      </Avatar.Root>
      <div>
        <p class="font-semibold text-slate-900">{book.name ?? ''}</p>
        <p class="text-slate-500/70">{book.email}</p>
      </div>
    </div>
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap capitalize">
    {book.role}
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap capitalize">
    {#if book.network}
      <img class="size-5" src={networks[book.network]} alt={book.network} />
    {/if}
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap">
    {#if book.last_login}
      {dayjs(new Date(book.last_login)).format('MM/DD/YYYY hh:mm A')}
    {/if}
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap">
    {book.last_ip ?? ''}
  </td>
  <td class="py-2.5 px-4 text-right whitespace-nowrap">
    <BookActions
      id={book.id}
      email={book.email}
      role={book.role}
      on:delete
      on:edit
    />
  </td>
</tr>
