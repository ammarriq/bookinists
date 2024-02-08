<script lang="ts">
  import type { Thumbnail as IThumbnail } from '@/pages/api/edition'

  import { toast } from 'svelte-sonner'
  import { createFormData } from '@/lib/utils'
  import AddThumbnails from './add-thumbnails.svelte'
  import Thumbnail from './thumbnail.svelte'

  type Status = 'idle' | 'pending' | 'resolved'

  export let thumbnails: IThumbnail[] = []
  export let errors: Record<string, string[]> | null = null

  let keys: string[] = thumbnails.map((o) => o.image)
  let statuses: Status[] = thumbnails.map(() => 'resolved')
  let progresses: number[] = thumbnails.map(() => 100)
  let files: (File | null)[] = thumbnails.map(() => null)

  const deleteFile = async (index: number) => {
    const thumbnail = thumbnails[index]
    if (!thumbnail) {
      keys = keys.filter((_, i) => i !== index)
      files = files.filter((_, i) => i !== index)
      progresses = progresses.filter((_, i) => i !== index)
      statuses = statuses.filter((_, i) => i !== index)

      return
    }

    const res = await fetch('/api/edition?delete_thumbnail', {
      method: 'POST',
      body: createFormData({
        id: thumbnail?.id,
        image: thumbnail?.image,
      }),
    })

    const json = (await res.json()) as FetchResponse<{ key: string }>

    if (!json.success) {
      const error = json.errors.message.at(-1)
      return toast.error(error ?? 'Something went wrong. Try again later.')
    }

    keys = keys.filter((_, i) => i !== index)
    files = files.filter((_, i) => i !== index)
    progresses = progresses.filter((_, i) => i !== index)
    statuses = statuses.filter((_, i) => i !== index)
    thumbnails = thumbnails.filter((_, i) => i !== index)
  }
</script>

<div class="grid gap-y-4 pb-6 px-6 rounded-md bg-white">
  <hgroup class="flex items-center justify-between py-4 border-b">
    <h3 class="font-medium">Thumbnail</h3>
  </hgroup>

  <AddThumbnails bind:keys bind:statuses bind:files bind:progresses />

  <ul class="space-y-2">
    {#each files as file, index (index)}
      {@const key = keys[index]}
      {@const status = statuses[index]}
      {@const progress = progresses[index]}
      {@const thumbnail = thumbnails[index]}

      <Thumbnail
        {index}
        {key}
        {file}
        {status}
        {progress}
        thumbnail_id={thumbnail?.id}
        thumbnail_type={thumbnail?.type}
        error={errors?.[`thumbnails.${index}.type`]}
        on:delete={(e) => deleteFile(e.detail.index)}
      />
    {/each}
  </ul>
</div>
