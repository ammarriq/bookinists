<script lang="ts">
  import { createFormData } from '@/lib/utils'
  import { toast } from 'svelte-sonner'

  export let name: string
  export let error: string[] | null = null
  export let key = ''
  export let status: 'idle' | 'pending' | 'resolved' = 'idle'

  let file: File
  let progress = 0

  const uploadFile = (formData: FormData) => {
    status = 'pending'

    const onReadyStateChange = (xhr: XMLHttpRequest) => {
      if (xhr.readyState !== 4) return

      const res = JSON.parse(xhr.response) as FetchResponse<{ key: string }>
      if (!res.success) {
        return toast.error(res.errors.file[0])
      }

      key = res.data.key
    }

    const onProgress = (e: ProgressEvent<EventTarget>) => {
      if (!e.lengthComputable) return
      progress = Math.round((e.loaded / e.total) * 100)
    }

    const xhr = new XMLHttpRequest()
    xhr.addEventListener('load', () => (status = 'resolved'))
    xhr.upload.addEventListener('progress', (e) => onProgress(e))
    xhr.addEventListener('readystatechange', () => onReadyStateChange(xhr))

    xhr.open('PUT', '/api/file')
    xhr.send(formData)
  }

  const onchange = async (e: Event) => {
    const target = e.target as HTMLInputElement
    file = target.files![0]

    if (!file.type.includes('image/')) {
      return toast.error('Invalid file type')
    }

    const formData = createFormData({ file })
    uploadFile(formData)
  }

  const deleteFile = async () => {
    console.log('deleted')

    const res = await fetch('/api/file', {
      method: 'DELETE',
      body: createFormData({ key }),
    })

    const json = (await res.json()) as FetchResponse<{ key: string }>

    if (!json.success) {
      const error = json.errors.message.at(-1)
      return toast.error(error ?? 'Something went wrong. Try again later.')
    }

    status = 'idle'
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
    class="relative flex gap-2 flex-col items-center
    justify-center border cursor-pointer p-2 rounded-md
    focus-within:outline"
    class:border-red-500={!!error?.length}
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
        <span>Drag and drop or</span>
        <span class="text-amber-300 font-semibold">Browse</span>
      </p>

      <p class="text-xs text-gray-400 mt-1">Only images accepted</p>
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
  <div class="relative border rounded-md w-full mx-auto pl-10 p-3 text-sm">
    {#if status === 'pending'}
      <i
        class="icon-[tabler--loader-2] animate-spin
        absolute top-3.5 left-3.5 size-3.5 duration-300"
      />
    {:else}
      <i
        class="icon-[tabler--check] size-3.5
        absolute top-3.5 left-3 text-green-500"
      />
    {/if}

    {#if status === 'resolved'}
      <button
        type="button"
        class="size-3.5 absolute top-4 right-3.5"
        on:click={deleteFile}
      >
        <i class="icon-[tabler--x]" />
      </button>
    {/if}

    <div class="space-y-0.5 mr-10">
      <p class="font-medium line-clamp-1">
        {file?.name ?? key.split(':::').at(-1)}
      </p>
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

  <input type="hidden" {name} value={key} />
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
