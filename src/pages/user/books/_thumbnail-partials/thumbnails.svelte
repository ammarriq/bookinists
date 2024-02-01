<script lang="ts">
  import type { Thumbnail as IThumbnail } from '@/pages/api/thumbnail'

  import Thumbnail from './thumbnail.svelte'
  import AddThumbnail from './add-thumbnail.svelte'

  export let edition_id: string
  export let thumbnails: IThumbnail[] = []

  let dialogOpen = false

  let thumbnailList = [...thumbnails]
</script>

<div class="grid gap-y-4 pb-6 px-6 rounded-md bg-white">
  <hgroup class="flex items-center justify-between py-4 border-b">
    <h3 class="font-medium">Thumbnail</h3>
    <button
      class="icon-[tabler--circle-plus] size-5"
      on:click={() => (dialogOpen = true)}
    />
  </hgroup>

  <ul>
    {#each thumbnailList as thumbnail, i (i)}
      <Thumbnail
        {thumbnail}
        on:delete={(e) => {
          thumbnailList = thumbnailList.filter((o) => o.id !== e.detail)
        }}
      />
    {/each}
  </ul>
</div>

<AddThumbnail {edition_id} bind:dialogOpen />
