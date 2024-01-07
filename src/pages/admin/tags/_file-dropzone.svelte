<script lang="ts">
  import { createFormData } from '@/lib/utils'
  import { toast } from 'svelte-sonner'

  export let error: string[] = []
  export let filename = ''
  export let status: 'idle' | 'pending' | 'resolved' = 'idle'

  let file: File
  let progress = 0

  const onchange = (e: Event) => {
    const target = e.target as HTMLInputElement
    file = target.files![0]
    filename = `${Date.now()}-${file.name}`

    if (!file.type.includes('image/')) {
      return toast.error('Invalid file type')
    }

    const formData = createFormData({
      filename: filename,
      file: file,
    })

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/upload-file')

    xhr.upload.onload = () => (status = 'pending')
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        progress = Math.round((e.loaded / e.total) * 100)
      }
    }

    xhr.send(formData)
    xhr.onload = () => (status = 'resolved')
  }
</script>

{#if status === 'idle'}
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <label
    on:dragenter|preventDefault={(e) => {
      e.currentTarget.classList.add('bg-slate-100')
    }}
    on:dragleave|preventDefault={(e) => {
      e.currentTarget.classList.remove('bg-slate-100')
    }}
    tabindex="0"
    class="relative flex gap-2 flex-col items-center
    justify-center border cursor-pointer p-2 rounded-md"
    class:border-red-500={!!error.length}
  >
    {#if !!error}
      <small class="text-sm absolute top-full left-0 text-red-500">
        {error}
      </small>
    {/if}
    <div class="size-12 grid place-items-center rounded-full bg-slate-100">
      <i class="icon-[tabler--cloud-upload] size-6 text-primary" />
    </div>

    <div class="text-center">
      <p class="text-primary text-sm font-semibold">
        <span>Drag and drop to upload</span>
        <span>or browse files</span>
      </p>

      <p class="text-sm text-gray-400">Only images accepted</p>
    </div>

    <input
      on:change={onchange}
      type="file"
      class="absolute inset-0 opacity-0 cursor-pointer"
      accept="image/*"
    />
  </label>
{/if}

{#if status !== 'idle'}
  <div class="relative border mt-4 rounded-md mx-auto pl-10 p-3 text-sm">
    {#if status === 'pending'}
      <i
        class="icon-[tabler--loader-2] animate-spin
        absolute top-4 left-3.5 size-3.5 duration-300"
      />
    {:else}
      <i
        class="icon-[tabler--check] size-3.5
        absolute top-4 left-3 text-green-500"
      />
    {/if}

    {#if status === 'resolved'}
      <button
        type="button"
        on:click={() => (status = 'idle')}
        class="icon-[tabler--x] size-3.5 absolute top-4 right-3.5"
      />
    {/if}

    <div class="space-y-0.5 mr-10">
      <p class="font-medium line-clamp-1">{filename}</p>
      {#if file}
        <p class="text-xs text-gray-500/70">
          {(file.size / (1024 * 1024)).toFixed(2)} MB
        </p>
      {/if}
    </div>

    {#if status === 'pending'}
      <div class="mt-1 flex gap-3 items-center">
        <progress id="progress" max="100" value={progress} />
        <label class="w-12 text-right" for="progress">{progress}%</label>
      </div>
    {/if}
  </div>

  <input type="hidden" name="icon" value={filename} />
{/if}

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
