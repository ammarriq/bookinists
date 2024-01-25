<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { Country } from '@/pages/api/country'

  import { fade, fly } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import { Dialog, DropdownMenu as Dropdown } from 'bits-ui'
  import Field from '@/components/field.svelte'
  import FileDropzone from '@/components/file-dropzone.svelte'

  export let country: Country

  let flagKey = country.flag
  let submitting = false
  let dialogOpen = false

  let deleteForm: HTMLFormElement
  let errors: Record<keyof Country, string[]> | null = null

  const dispatch = createEventDispatcher<{
    edit: Country
    delete: string
  }>()

  const editCountry: FormEventHandler<HTMLFormElement> = async (e) => {
    submitting = true

    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Omit<Country, 'icon'>>
    if (!json.success) return (errors = json.errors)

    dialogOpen = false
    dispatch('edit', { ...json.data, flag: flagKey })
  }

  const deleteCountry = async () => {
    if (!confirm('Are you sure you wanna delete the country?')) return
    submitting = true

    const form = deleteForm
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Country>
    if (!json.success) return (errors = json.errors)

    dispatch('delete', country.id)
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
      on:click={deleteCountry}
      disabled={submitting}
    >
      <form
        action="/api/country?delete"
        method="post"
        bind:this={deleteForm}
        on:submit|preventDefault
      >
        <input type="hidden" name="id" value={country.id} />
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
        <h2 class="text-base font-semibold">Edit Country</h2>
      </Dialog.Title>

      <form
        action="/api/country?edit"
        method="post"
        class="space-y-4"
        on:submit|preventDefault={editCountry}
      >
        <input type="hidden" name="id" value={country.id} />

        <FileDropzone
          name="flag"
          error={errors?.flag}
          status={flagKey ? 'resolved' : 'idle'}
          bind:key={flagKey}
        />

        <Field label="Name" error={errors?.name}>
          <input
            type="text"
            name="name"
            class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
            shadow-sm focus:outline-slate-900"
            class:border-red-500={!!errors?.name}
            value={country.name}
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
