<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { Tag } from '@/pages/api/tag'

  import { fade, fly } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import { Dialog } from 'bits-ui'
  import FileDropzone from './_file-dropzone.svelte'

  export let dialogOpen = false

  let submitting = false
  let errors: Record<string, string[]> = {}

  const dispatch = createEventDispatcher<{ submit: Tag }>()

  const submit: FormEventHandler<HTMLFormElement> = async (e) => {
    submitting = true

    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Tag>
    if (!json.success) return (errors = json.errors)

    dispatch('submit', json.data)
    dialogOpen = false
  }
</script>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Portal>
    <Dialog.Overlay
      transition={(node) => fade(node, { duration: 150 })}
      class="fixed inset-0 bg-black/60 z-50"
    />

    <Dialog.Content
      transition={(node) => fly(node, { y: '10px', duration: 150 })}
      class="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2
      -translate-y-1/2 rounded-md border bg-white py-5 px-6 outline-none"
    >
      <button
        class="icon-[tabler--x] absolute top-4 right-4"
        on:click={() => (dialogOpen = false)}
      />

      <Dialog.Title class="space-y-1 mb-4">
        <h2 class="text-base font-semibold">Add Tag</h2>
      </Dialog.Title>

      <form
        action="/api/tag?add"
        method="post"
        class="space-y-4"
        on:submit|preventDefault={submit}
      >
        <FileDropzone error={errors.icon} />

        <label class="block">
          <span class="text-sm font-medium"> Name </span>
          <div class="relative w-full mt-0.5">
            {#if !!errors.name}
              <small class="text-sm absolute top-full left-0 text-red-500">
                {errors.name}
              </small>
            {/if}
            <input
              type="text"
              name="name"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors.name}
            />
          </div>
        </label>

        <fieldset class="grid grid-cols-2 gap-x-4">
          <label class="grid">
            <span class="text-sm font-medium"> Text color </span>
            <div class="relative w-full mt-0.5">
              {#if !!errors.text_color}
                <small class="text-sm absolute top-full left-0 text-red-500">
                  {errors.text_color}
                </small>
              {/if}
              <input
                type="color"
                name="text_color"
                class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
                shadow-sm focus:outline-slate-900"
                class:border-red-500={!!errors.text_color}
              />
            </div>
          </label>

          <label class="grid">
            <span class="text-sm font-medium"> Background color </span>
            <div class="relative w-full mt-0.5">
              {#if !!errors.bg_color}
                <small class="text-sm absolute top-full left-0 text-red-500">
                  {errors.bg_color}
                </small>
              {/if}
              <input
                type="color"
                name="bg_color"
                class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
                shadow-sm focus:outline-slate-900"
                class:border-red-500={!!errors.bg_color}
              />
            </div>
          </label>
        </fieldset>

        <label class="block">
          <span class="text-sm font-medium"> Description </span>
          <div class="relative w-full mt-0.5 grid">
            {#if !!errors.description}
              <small class="text-sm absolute top-full left-0 text-red-500">
                {errors.description}
              </small>
            {/if}
            <textarea
              name="description"
              class="border w-full px-3 py-1.5 rounded-md text-sm
              shadow-sm focus:outline-slate-900 h-20"
              class:border-red-500={!!errors.description}
            />
          </div>
        </label>

        <button
          class="flex items-center justify-center text-sm text-white font-medium
          px-4 py-1.5 rounded-md ml-auto mt-4 bg-slate-900
          hover:bg-slate-900/90 disabled:bg-slate-900/50"
          disabled={submitting}
        >
          {#if submitting}
            <i class="icon-[tabler--loader-2] shrink-0 animate-spin mr-1.5" />
          {/if}
          Submit
        </button>
      </form>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
