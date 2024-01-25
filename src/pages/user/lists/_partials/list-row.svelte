<script lang="ts">
  import type { List } from '@/pages/api/list'

  import { Avatar } from 'bits-ui'
  import ListActions from './list-actions.svelte'

  export let list: List

  let image = ''

  const getFile = async (key: string) => {
    const res = await fetch(`/api/file?key=${key}`)

    const blob = new Blob([await res.arrayBuffer()])
    const url = URL.createObjectURL(blob)

    image = url
  }

  $: if (typeof window !== 'undefined') {
    getFile(list.image)
  }
</script>

<tr class="text-sm border-b">
  <td class="py-2.5 px-4 whitespace-nowrap">
    <div class="flex gap-2 items-center min-w-max">
      <Avatar.Root class="flex size-8 items-center justify-center rounded-full">
        <Avatar.Image src={image} alt={list.name} />
        <Avatar.Fallback
          class="flex items-center justify-center
          bg-red-600 rounded-full size-8"
        >
          <i class="icon-[tabler--file] size-6 text-white" />
        </Avatar.Fallback>
      </Avatar.Root>
      <div>
        <p class="font-semibold text-slate-900">{list.name ?? ''}</p>
      </div>
    </div>
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap capitalize">
    {list.list_type}
  </td>

  <td class="py-2.5 px-4 whitespace-nowrap">
    {list.url}
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap">
    {list.description}
  </td>
  <td class="py-2.5 px-4 text-right whitespace-nowrap">
    <ListActions {list} on:delete on:edit />
  </td>
</tr>
