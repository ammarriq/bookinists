<script lang="ts">
  import type { Collection } from '@/pages/api/collection'

  import { onMount } from 'svelte'
  import { Avatar } from 'bits-ui'
  import CollectionActions from './_collection-actions.svelte'

  export let collection: Collection

  let image = ''

  const getFile = async (key: string) => {
    const res = await fetch(`/api/file?key=${key}`)

    const blob = new Blob([await res.arrayBuffer()])
    const url = URL.createObjectURL(blob)

    image = url
  }

  onMount(() => {
    getFile(collection.image)
  })
</script>

<li class="relative text-sm bg-slate-100 rounded-md px-5 py-4">
  <div class="absolute top-4 right-5 z-20">
    <CollectionActions {collection} on:delete on:edit />
  </div>

  <Avatar.Root class="flex h-40 items-center justify-center rounded-full">
    <Avatar.Image
      class="size-full object-contain"
      src={image}
      alt={collection.name}
    />
    <Avatar.Fallback class="flex items-center justify-center size-full">
      <i class="icon-[tabler--album] size-full text-slate-900" />
    </Avatar.Fallback>
  </Avatar.Root>

  <div class="space-y-2 mt-4">
    <p class="font-semibold text-slate-900">{collection.name ?? ''}</p>
    <p class="text-slate-500 leading-relaxed pr-1 line-clamp-3">
      {collection.description}
    </p>
  </div>
</li>
