<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import TypeSelection from './type-selection.svelte'
  import Image from '@/components/image.svelte'

  export let index: number
  export let file: File | null
  export let key: string
  export let status: string
  export let progress: number
  export let thumbnail_id = ''
  export let thumbnail_type = ''
  export let error: string[] = []

  const dispatch = createEventDispatcher<{
    delete: { index: number }
  }>()
</script>

<li class="relative border rounded-md w-full mx-auto p-3 text-sm">
  <header class="flex items-center gap-2">
    {#if file === null}
      <Image
        class="h-10 w-8 object-cover"
        src={key}
        alt={key.split(':::').at(-1)}
      >
        <div slot="fallback" class="h-10 w-8 bg-slate-100 animate-pulse" />
      </Image>

      <div class="space-y-0.5 mr-10">
        <p class="font-medium line-clamp-1">
          {key.split(':::').at(-1)}
        </p>
      </div>
    {:else}
      <img
        class="h-10 w-8 object-cover"
        src={URL.createObjectURL(file)}
        alt={file.name}
      />

      <div class="space-y-0.5 mr-10">
        <p class="font-medium line-clamp-1">
          {file?.name ?? key.split(':::').at(-1)}
        </p>

        <p class="text-xs text-gray-500/70">
          {(file.size / (1024 * 1024)).toFixed(2)} MB
        </p>
      </div>
    {/if}
  </header>

  {#if status === 'resolved'}
    <button
      type="button"
      class="icon-[tabler--x] size-3.5 absolute top-4 right-3.5"
      on:click={() => dispatch('delete', { index })}
    />
  {/if}

  {#if status === 'pending'}
    <div class="mt-1 flex gap-3 items-center">
      <progress id="progress" max="100" value={progress} />
      <label class="w-12 text-right" for="progress">{progress}%</label>
    </div>
  {/if}
</li>

<input type="hidden" name="thumbnails.{index}.id" value={thumbnail_id} />
<input type="hidden" name="thumbnails.{index}.is_new" value={file !== null} />
<input type="hidden" name="thumbnails.{index}.image" value={key} />
<TypeSelection {thumbnail_type} name="thumbnails.{index}.type" {error} />

<style lang="postcss">
  progress {
    @apply w-full h-2 rounded-full;
  }

  progress::-webkit-progress-bar {
    @apply bg-black/10 rounded-full;
  }

  progress::-webkit-progress-value {
    @apply bg-amber-300 transition-[width] duration-1000 rounded-full;
  }

  progress::-moz-progress-bar {
    @apply bg-black/10 rounded-full;
  }
</style>
