<script lang="ts">
  import type { Award } from '@/pages/api/award'

  import { Avatar } from 'bits-ui'
  import AwardActions from './award-actions.svelte'

  export let award: Award

  let image = ''

  const getFile = async (key: string) => {
    const res = await fetch(`/api/file?key=${key}`)

    const blob = new Blob([await res.arrayBuffer()])
    const url = URL.createObjectURL(blob)

    image = url
  }

  $: if (typeof window !== 'undefined') {
    getFile(award.image)
  }
</script>

<li class="text-sm bg-slate-100 rounded-md px-5 py-4 space-y-4">
  <header class="flex items-center justify-between">
    <div class="flex gap-2 items-center min-w-max">
      <Avatar.Root class="flex size-7 items-center justify-center rounded-full">
        <Avatar.Image src={image} alt={award.name} />
        <Avatar.Fallback
          class="flex items-center justify-center
          bg-red-600 rounded-full size-7"
        >
          <i class="icon-[tabler--user] size-5 text-white" />
        </Avatar.Fallback>
      </Avatar.Root>

      <p class="font-semibold text-slate-900">{award.name ?? ''}</p>
    </div>

    <div class="flex items-center">
      <AwardActions {award} on:delete on:edit />
    </div>
  </header>

  <p class="text-slate-500 leading-relaxed pr-1 line-clamp-3">
    {award.description}
  </p>
</li>
