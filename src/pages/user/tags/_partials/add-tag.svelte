<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { Tag } from '@/pages/api/tag'

  import { fade, fly } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import { Dialog } from 'bits-ui'
  import Field from '@/components/field.svelte'
  import FileDropzone from '@/components/file-dropzone.svelte'

  export let dialogOpen = false

  let iconKey = ''
  let submitting = false
  let errors: Record<keyof Tag, string[]> | null = null

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
    const json = (await res.json()) as FetchResponse<Omit<Tag, 'icon'>>
    if (!json.success) return (errors = json.errors)

    dispatch('submit', { ...json.data, icon: iconKey })
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
        <FileDropzone name="icon" error={errors?.icon} bind:key={iconKey} />

        <Field label="Name" error={errors?.name}>
          <input
            type="text"
            name="name"
            class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
            shadow-sm focus:outline-slate-900"
            class:border-red-500={!!errors?.name}
          />
        </Field>

        <fieldset class="grid grid-cols-2 gap-x-4">
          <Field label="Text color" error={errors?.text_color}>
            <input
              type="color"
              name="text_color"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.text_color}
            />
          </Field>

          <Field label="Background color" error={errors?.bg_color}>
            <input
              type="color"
              name="bg_color"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.bg_color}
            />
          </Field>
        </fieldset>

        <Field label="Description" error={errors?.description}>
          <textarea
            name="description"
            class="border w-full px-3 py-1.5 rounded-md text-sm
            shadow-sm focus:outline-slate-900 h-20"
            class:border-red-500={!!errors?.description}
          />
        </Field>

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
