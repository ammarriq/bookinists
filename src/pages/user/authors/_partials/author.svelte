<script lang="ts">
  import type { Author } from '@/pages/api/author'

  import { Avatar } from 'bits-ui'
  import AuthorActions from './author-actions.svelte'

  export let author: Author

  let avatar = ''

  const getFile = async (key: string) => {
    const res = await fetch(`/api/file?key=${key}`)

    const blob = new Blob([await res.arrayBuffer()])
    const url = URL.createObjectURL(blob)

    avatar = url
  }

  $: if (typeof window !== 'undefined') {
    getFile(author.avatar)
  }
</script>

<li class="text-sm bg-slate-100 rounded-md px-5 py-4 space-y-4">
  <header class="grid grid-cols-[auto_1fr_auto] items-center gap-2">
    <Avatar.Root class="flex size-7 items-center justify-center rounded-full">
      <Avatar.Image src={avatar} alt={author.name} />
      <Avatar.Fallback
        class="flex items-center justify-center
        bg-red-600 rounded-full size-7"
      >
        <i class="icon-[tabler--user] size-5 text-white" />
      </Avatar.Fallback>
    </Avatar.Root>

    <p class="font-semibold text-slate-900 whitespace-nowrap truncate">
      {author.name ?? ''}
    </p>

    <div class="flex items-center">
      <AuthorActions {author} on:delete on:edit />
    </div>
  </header>

  {#if author.info}
    <p class="text-slate-500 leading-relaxed pr-1 line-clamp-3">
      {author.info}
    </p>
  {/if}
</li>
