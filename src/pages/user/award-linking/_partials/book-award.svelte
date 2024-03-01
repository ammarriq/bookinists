<script lang="ts">
  import type { SelectItem } from '@/lib/types'
  import type { AwardLinking as BookAward } from '@/pages/api/award-linking'

  import BookAwardActions from './book-award-actions.svelte'

  export let bookAward: BookAward

  const getEntity = async (o: { entity: string; id: string }) => {
    const res = await fetch(`/api/${o.entity}/${o.id}`)
    const json = (await res.json()) as FetchResponse<SelectItem>

    return json.data
  }

  const getDetails = async (details: BookAward) => {
    const [book, award, category] = await Promise.all([
      getEntity({ entity: 'book', id: details.book_id }),
      getEntity({ entity: 'award', id: details.award_id }),
      getEntity({ entity: 'award-category', id: details.award_category_id }),
    ])

    return { book, award, category }
  }
</script>

<tr class="text-sm border-b">
  {#await getDetails(bookAward)}
    <td class="py-2.5 px-4">
      <p class="w-16 rounded-lg bg-gray-100 animate-pulse">&nbsp;</p>
    </td>
    <td class="py-2.5 px-4">
      <p class="w-28 rounded-lg bg-gray-100 animate-pulse">&nbsp;</p>
    </td>
    <td class="py-2.5 px-4">
      <p class="w-40 rounded-lg bg-gray-100 animate-pulse">&nbsp;</p>
    </td>
    <td class="py-2.5 px-4">
      <p class="ml-auto w-4 rounded-lg bg-gray-100 animate-pulse">&nbsp;</p>
    </td>
  {:then data}
    <td class="py-2.5 px-4 whitespace-nowrap">
      {data.book?.label}
    </td>
    <td class="py-2.5 px-4 whitespace-nowrap">
      {data.award?.label}
    </td>
    <td class="py-2.5 px-4 whitespace-nowrap">
      {data.category?.label}
    </td>
    <td class="py-2.5 px-4 text-right whitespace-nowrap">
      <BookAwardActions {bookAward} on:delete on:edit />
    </td>
  {/await}
</tr>
