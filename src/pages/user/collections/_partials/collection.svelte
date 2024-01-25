<script lang="ts">
  import type { Collection } from '@/pages/api/collection'

  import { Avatar } from 'bits-ui'
  import CollectionActions from './collection-actions.svelte'

  export let collection: Collection

  let image = ''

  const getFile = async (key: string) => {
    const res = await fetch(`/api/file?key=${key}`)

    const blob = new Blob([await res.arrayBuffer()])
    const url = URL.createObjectURL(blob)

    image = url
  }

  $: if (typeof window !== 'undefined') {
    getFile(collection.image)
  }
</script>

<li class="relative text-sm bg-slate-100 rounded-md overflow-hidden">
  <Avatar.Root class="flex h-36 items-center justify-center rounded-full">
    <Avatar.Image
      class="size-full object-cover"
      src={image}
      alt={collection.name}
    />
    <Avatar.Fallback class="grid place-items-center size-full">
      <i class="icon-[tabler--loader-2] size-5 animate-spin duration-300" />
    </Avatar.Fallback>
  </Avatar.Root>

  <div class="flex items-center justify-between px-5 pt-4 pb-3 z-20">
    <p class="font-semibold text-slate-900">{collection.name ?? ''}</p>

    <div>
      <CollectionActions {collection} on:delete on:edit />
    </div>
  </div>

  <div class="space-y-2 px-5 pb-4">
    <p class="text-slate-500 leading-relaxed pr-1 line-clamp-3">
      {collection.description}
    </p>
  </div>
</li>
