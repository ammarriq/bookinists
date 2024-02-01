<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { Thumbnail } from '@/pages/api/thumbnail'

  import { createEventDispatcher } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import { Dialog, Select } from 'bits-ui'
  import { thumbnail_type } from '@/lib/constants'
  import Field from '@/components/field.svelte'
  import FileDropzone from '@/components/file-dropzone.svelte'

  export let edition_id: string
  export let dialogOpen = false

  let imageKey = ''
  let submitting = false
  let errors: Record<keyof Thumbnail, string[]> | null = null

  const dispatch = createEventDispatcher<{ submit: Thumbnail }>()

  const submit: FormEventHandler<HTMLFormElement> = async (e) => {
    submitting = true

    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Omit<Thumbnail, 'icon'>>
    if (!json.success) return (errors = json.errors)

    dispatch('submit', { ...json.data, image: imageKey })
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
      class="dialog fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2
      -translate-y-1/2 rounded-md border bg-white py-5 px-6 outline-none max-w-md"
    >
      <button
        class="icon-[tabler--x] absolute top-4 right-4"
        on:click={() => (dialogOpen = false)}
      />

      <Dialog.Title class="mb-4">
        <h2 class="text-base font-semibold">Add Thumbnail</h2>
      </Dialog.Title>

      <form
        action="/api/thumbnail?add"
        method="post"
        class="space-y-4"
        on:submit|preventDefault={submit}
      >
        <input type="hidden" name="edition_id" value={edition_id} />
        <FileDropzone name="image" error={errors?.image} bind:key={imageKey} />

        <Field label="Type" error={errors?.type}>
          <Select.Root portal=".dialog">
            <Select.Trigger
              class="flex items-center justify-between border w-full px-3
              py-1.5 rounded-md text-sm shadow-sm focus:outline-slate-900
              {!!errors?.type ? 'border-red-500' : ''}"
              aria-label="Select type"
            >
              <Select.Value
                class="text-sm first-letter:capitalize"
                placeholder="Select type"
              />
              <Select.Input name="type" />
              <i class="icon-[tabler--selector]" />
            </Select.Trigger>
            <Select.Content
              class="w-full rounded-md p-1 border bg-white  shadow-sm z-40"
              transition={(e) => fly(e, { duration: 150, y: -5 })}
              sideOffset={8}
            >
              {#each thumbnail_type as type}
                <Select.Item
                  class="px-2 py-1 text-sm capitalize rounded-md cursor-default hover:bg-slate-100"
                  value={type}
                  label={type}
                >
                  {type}
                </Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
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
