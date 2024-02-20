<script lang="ts">
  import type { Tag } from '@/pages/api/tag'

  import Image from '@/components/image.svelte'
  import TagActions from './tag-actions.svelte'

  export let tag: Tag
</script>

<li class="text-sm bg-slate-100 rounded-md px-5 py-4 space-y-4">
  <header class="grid grid-cols-[auto_1fr_auto] items-center gap-2">
    <Image
      class="flex size-7 items-center justify-center rounded-full"
      src={tag.icon}
      alt={tag.name}
    >
      <div
        slot="fallback"
        class="flex items-center justify-center
        bg-red-600 rounded-full size-7"
      >
        <i class="icon-[tabler--icons] size-5 text-white" />
      </div>
    </Image>

    <p class="font-semibold text-slate-900 whitespace-nowrap truncate">
      {tag.name ?? ''}
    </p>

    <div class="flex items-center">
      <TagActions {tag} on:delete on:edit />
    </div>
  </header>

  <div
    class="px-1 py-3 text-xxs text-center uppercase
    font-semibold tracking-wider rounded-md"
    style:color={tag.text_color}
    style:background-color={tag.bg_color || '#fff'}
  >
    Ammar Iqbal
  </div>

  {#if tag.description}
    <p class="text-slate-500 leading-relaxed pr-1 line-clamp-3">
      {tag.description}
    </p>
  {/if}
</li>
