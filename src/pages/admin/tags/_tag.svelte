<script lang="ts">
  import type { Tag } from '@/pages/api/tag'

  import { onMount } from 'svelte'
  import { Avatar } from 'bits-ui'
  import TagActions from './_tag-actions.svelte'

  export let tag: Tag

  let icon: string

  const getFile = async (key: string) => {
    const res = await fetch(`/api/file?key=${key}`)
    const blob = new Blob([await res.arrayBuffer()])
    const url = URL.createObjectURL(blob)

    icon = url
  }

  onMount(() => {
    getFile(tag.icon)
  })
</script>

<li class="text-sm bg-slate-100 rounded-md px-5 py-4 space-y-4">
  <header class="flex items-center justify-between">
    <div class="flex gap-2 items-center min-w-max">
      <Avatar.Root class="flex size-7 items-center justify-center rounded-full">
        <Avatar.Image src={icon} alt={tag.name} />
        <Avatar.Fallback
          class="flex items-center justify-center
          bg-red-600 rounded-full size-7"
        >
          <i class="icon-[tabler--icons] size-5 text-white" />
        </Avatar.Fallback>
      </Avatar.Root>

      <p class="font-semibold text-slate-900">{tag.name ?? ''}</p>
    </div>

    <div class="flex items-center">
      <TagActions {tag} on:delete on:edit />
    </div>
  </header>

  <div
    class="px-1 py-3 text-xxs text-center uppercase
    font-semibold tracking-wider rounded-md"
    style:color={tag.text_color}
    style:background-color={tag.bg_color}
  >
    Ammar Iqbal
  </div>

  <p class="text-slate-500 leading-relaxed pr-1 line-clamp-3">
    {tag.description}
  </p>
</li>
