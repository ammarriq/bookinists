<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { Collection as ICollection } from '@/pages/api/collection'

  import { fade, fly } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import { Dialog, DropdownMenu as Dropdown } from 'bits-ui'
  import FileDropzone from './_file-dropzone.svelte'

  export let collection: ICollection

  let submitting = false
  let dialogOpen = false

  let deleteForm: HTMLFormElement
  let errors: Record<string, string[]> = {}

  const dispatch = createEventDispatcher<{
    edit: ICollection
    delete: string
  }>()

  const editColl: FormEventHandler<HTMLFormElement> = async (e) => {
    submitting = true

    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<ICollection>
    if (!json.success) return (errors = json.errors)

    dialogOpen = false
    dispatch('edit', json.data)
  }

  const deleteColl = async () => {
    if (!confirm('Are you sure you wanna delete the collection?')) return
    submitting = true

    const form = deleteForm
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<ICollection>
    if (!json.success) return (errors = json.errors)

    dispatch('delete', collection.id)
  }
</script>

<Dropdown.Root disableFocusFirstItem>
  <Dropdown.Trigger class="size-5">
    <i class="icon-[tabler--dots-vertical] text-slate-900 size-5" />
  </Dropdown.Trigger>

  <Dropdown.Content
    transition={(e) => fly(e, { duration: 150, y: 10 })}
    align="end"
    class="p-1 rounded-md w-40 text-sm bg-white shadow mt-1"
  >
    <Dropdown.Item
      class="text-left w-full px-3 py-1.5 rounded-md hover:bg-slate-100"
      on:click={() => (dialogOpen = true)}
    >
      Edit
    </Dropdown.Item>
    <Dropdown.Item
      class="text-left w-full px-3 py-1.5 rounded-md hover:bg-slate-100"
      on:click={deleteColl}
      disabled={submitting}
    >
      <form
        action="/api/collection?delete"
        method="post"
        bind:this={deleteForm}
        on:submit|preventDefault
      >
        <input type="hidden" name="id" value={collection.id} />
        <button type="submit" disabled={submitting}>Delete</button>
      </form>
    </Dropdown.Item>
  </Dropdown.Content>
</Dropdown.Root>
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
        <h2 class="text-base font-semibold">Edit Collection</h2>
      </Dialog.Title>

      <form
        action="/api/collection?edit"
        method="post"
        class="space-y-4"
        on:submit|preventDefault={editColl}
      >
        <input type="hidden" name="id" value={collection.id} />
        <FileDropzone
          error={errors.image}
          key={collection.image}
          status="resolved"
        />

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
              value={collection.name}
              class:border-red-500={!!errors.name}
            />
          </div>
        </label>

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
              value={collection.description}
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
