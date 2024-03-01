<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { Award } from '@/pages/api/award'

  import { fade, fly } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import { Dialog, DropdownMenu as Dropdown } from 'bits-ui'
  import { clickParent } from '@/lib/actions'
  import Field from '@/components/field.svelte'
  import FileDropzone from '@/components/file-dropzone.svelte'
  import CountrySelect from '../../_country-select.svelte'
  import GenreSelect from './genre-select.svelte'

  export let award: Award

  let imageKey = award.image
  let submitting = false
  let dialogOpen = false

  let deleteForm: HTMLFormElement
  let errors: Record<keyof Award, string[]> | null = null

  const dispatch = createEventDispatcher<{
    edit: Award
    delete: string
  }>()

  const editAward: FormEventHandler<HTMLFormElement> = async (e) => {
    submitting = true

    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Omit<Award, 'icon'>>

    if (!json.success) return (errors = json.errors)

    dialogOpen = false
    dispatch('edit', { ...json.data, image: imageKey })
  }

  const deleteAward = async () => {
    if (!confirm('Are you sure you wanna delete the award?')) return
    submitting = true

    const form = deleteForm
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Award>
    if (!json.success) return (errors = json.errors)

    dispatch('delete', award.id)
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
      on:click={deleteAward}
      disabled={submitting}
    >
      <form
        action="/api/award?delete"
        method="post"
        bind:this={deleteForm}
        on:submit|preventDefault
      >
        <input type="hidden" name="id" value={award.id} />
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
      class="dialog fixed inset-0 grid place-items-center
      py-12 overflow-y-auto bg-transparent z-50"
    >
      <div
        transition:fly={{ y: '10px', duration: 150 }}
        class="relative py-5 px-6 border rounded-md bg-white
        w-[calc(100%-2rem)] max-w-md outline-none"
        use:clickParent={() => (dialogOpen = false)}
      >
        <button
          class="icon-[tabler--x] absolute top-4 right-4"
          on:click={() => (dialogOpen = false)}
        />

        <Dialog.Title class="space-y-1 mb-4">
          <h2 class="text-base font-semibold">Edit Award</h2>
        </Dialog.Title>

        <form
          action="/api/award?edit"
          method="post"
          class="space-y-4"
          on:submit|preventDefault={editAward}
        >
          <input type="hidden" name="id" value={award.id} />

          <FileDropzone
            name="image"
            error={errors?.image}
            status={imageKey ? 'resolved' : 'idle'}
            bind:key={imageKey}
          />

          <Field label="Name" error={errors?.name}>
            <input
              type="text"
              name="name"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.name}
              value={award.name}
            />
          </Field>

          <Field label="URL" error={errors?.url}>
            <input
              type="text"
              name="url"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.url}
              value={award.url}
            />
          </Field>

          <Field label="Genre" error={errors?.country_id}>
            <GenreSelect genre_id={award.genre_id} />
          </Field>

          <Field label="Country" error={errors?.country_id}>
            <CountrySelect
              error={errors?.country_id}
              country_id={award.country_id ?? ''}
            />
          </Field>

          <Field label="Description" error={errors?.description}>
            <textarea
              name="description"
              class="border w-full px-3 py-1.5 rounded-md text-sm
              shadow-sm focus:outline-slate-900 h-20"
              class:border-red-500={!!errors?.description}
              value={award.description}
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
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
