<script lang="ts">
  import type { Publisher } from '@/pages/api/publisher'

  import { Avatar } from 'bits-ui'
  import PublisherActions from './publisher-actions.svelte'

  export let publisher: Publisher

  let avatar = ''

  const getFile = async (key: string) => {
    const res = await fetch(`/api/file?key=${key}`)

    const blob = new Blob([await res.arrayBuffer()])
    const url = URL.createObjectURL(blob)

    avatar = url
  }

  $: if (typeof window !== 'undefined') {
    getFile(publisher.logo)
  }
</script>

<li class="text-sm bg-slate-100 rounded-md px-5 py-4 space-y-4">
  <header class="grid grid-cols-[auto_1fr_auto] items-center gap-2">
    <Avatar.Root class="flex size-7 items-center justify-center rounded-full">
      <Avatar.Image src={avatar} alt={publisher.name} />
      <Avatar.Fallback
        class="flex items-center justify-center
        bg-red-600 rounded-full size-7"
      >
        <i class="icon-[tabler--user] size-5 text-white" />
      </Avatar.Fallback>
    </Avatar.Root>

    <p class="font-semibold text-slate-900 whitespace-nowrap truncate">
      {publisher.name ?? ''}
    </p>

    <div class="flex items-center">
      <PublisherActions {publisher} on:delete on:edit />
    </div>
  </header>

  {#if publisher.info}
    <p class="text-slate-500 leading-relaxed pr-1 line-clamp-3">
      {publisher.info}
    </p>
  {/if}
</li>
