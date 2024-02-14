<script lang="ts">
  import { createFormData } from '@/lib/utils'
  import { toast } from 'svelte-sonner'

  export let keys: string[] = []
  export let statuses: ('idle' | 'pending' | 'resolved')[] = []
  export let files: (File | null)[] = []
  export let progresses: number[] = []

  const uploadFile = (formData: FormData, index: number) => {
    statuses[index] = 'pending'

    const onReadyStateChange = (xhr: XMLHttpRequest) => {
      if (xhr.readyState !== 4) return

      const res = JSON.parse(xhr.response) as FetchResponse<{ key: string }>
      if (!res.success) {
        return toast.error(res.errors.file[0])
      }

      keys = [...keys, res.data.key]
    }

    const onProgress = (e: ProgressEvent<EventTarget>) => {
      if (!e.lengthComputable) return
      progresses[index] = Math.round((e.loaded / e.total) * 100)
    }

    const xhr = new XMLHttpRequest()
    xhr.addEventListener('load', () => (statuses[index] = 'resolved'))
    xhr.upload.addEventListener('progress', (e) => onProgress(e))
    xhr.addEventListener('readystatechange', () => onReadyStateChange(xhr))

    xhr.open('PUT', '/api/file')
    xhr.send(formData)
  }

  const onchange = async (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files![0]

    files = [...files, file]
    progresses = [...progresses, 0]
    statuses = [...statuses, 'idle']

    if (!file.type.includes('image/')) {
      return toast.error('Invalid file type')
    }

    const formData = createFormData({ file })
    uploadFile(formData, statuses.length - 1)
  }
</script>

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
>
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
    on:change={(e) => onchange(e)}
    type="file"
    class="absolute inset-0 opacity-0 cursor-pointer"
    accept="image/*"
  />
</label>
