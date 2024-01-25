<script lang="ts">
  import type { Storage } from '@/pages/api/storage'

  import { Avatar } from 'bits-ui'
  import StorageActions from './storage-actions.svelte'

  export let storage: Storage

  let image = ''

  const getFile = async (key: string) => {
    const res = await fetch(`/api/file?key=${key}`)

    const blob = new Blob([await res.arrayBuffer()])
    const url = URL.createObjectURL(blob)

    image = url
  }

  $: if (typeof window !== 'undefined') {
    getFile(storage.image)
  }
</script>

<tr class="text-sm border-b">
  <td class="py-2.5 px-4 whitespace-nowrap">
    <div class="flex gap-2 items-center min-w-max">
      <Avatar.Root class="flex size-8 items-center justify-center rounded-full">
        <Avatar.Image src={image} alt={storage.name} />
        <Avatar.Fallback
          class="flex items-center justify-center
          bg-red-600 rounded-full size-8"
        >
          <i class="icon-[tabler--file] size-6 text-white" />
        </Avatar.Fallback>
      </Avatar.Root>
      <div>
        <p class="font-semibold text-slate-900">{storage.name ?? ''}</p>
      </div>
    </div>
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap capitalize">
    {storage.storage_type}
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap capitalize">
    <div class="size-4 rounded-md" style:background-color={storage.color} />
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap">
    {storage.width} * {storage.height}
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap">
    {storage.depth}
  </td>
  <td class="py-2.5 px-4 whitespace-nowrap">
    {storage.notes}
  </td>
  <td class="py-2.5 px-4 text-right whitespace-nowrap">
    <StorageActions {storage} on:delete on:edit />
  </td>
</tr>
