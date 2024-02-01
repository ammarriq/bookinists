<script lang="ts">
  import type { Thumbnail } from '@/pages/api/thumbnail'

  import ThumbnailActions from './thumbnail-actions.svelte'
  import Image from '@/components/image.svelte'

  export let thumbnail: Thumbnail
</script>

<li class="flex items-center gap-2">
  <Image
    class="flex w-6 h-8 items-center justify-center"
    src={thumbnail.image}
    alt="alt"
  >
    <div
      slot="fallback"
      class="flex items-center justify-center w-6 h-8
      rounded animate-pulse bg-slate-200"
    />
  </Image>

  <p class="text-sm capitalize">{thumbnail.type}</p>

  <div class="ml-auto">
    <ThumbnailActions id={thumbnail.id} on:delete />
  </div>
</li>
