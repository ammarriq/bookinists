<script lang="ts">
  import type { Edition } from '@/pages/api/edition'

  import EditionActions from './edition-actions.svelte'

  export let edition: Edition
  export let book_id: string

  const status = {
    unread: 'bg-red-500/20 text-red-500',
    reading: 'bg-yellow-500/20 text-yellow-500',
    read: 'bg-green-500/20 text-green-500',
  }
</script>

<tr class="text-sm border-b">
  <td class="py-2.5 px-4 whitespace-nowrap">
    <a
      href="/user/books/{book_id}/{edition.id}"
      class="text-slate-900 font-medium min-w-max"
    >
      {edition.isbn13 ?? ''}
    </a>
  </td>

  <td class="py-2.5 px-4 whitespace-nowrap">
    {edition.isbn}
  </td>

  <td class="py-2.5 px-4 whitespace-nowrap">
    {edition.pages ?? 0}
  </td>

  <td class="py-2.5 px-4 whitespace-nowrap">
    <span class="block px-2 rounded-full max-w-max">
      {edition.lend_status ?? 'N/A'}
    </span>
  </td>

  <td class="py-2.5 px-4 text-right whitespace-nowrap">
    <EditionActions {edition} on:delete on:edit />
  </td>
</tr>
