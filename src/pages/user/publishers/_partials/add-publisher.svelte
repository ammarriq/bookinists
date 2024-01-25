<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { Publisher } from '@/pages/api/publisher'

  import { fade, fly } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import { Dialog } from 'bits-ui'
  import Field from '@/components/field.svelte'
  import FileDropzone from '@/components/file-dropzone.svelte'
  import CountrySelect from '../../_country-select.svelte'

  export let dialogOpen = false

  let logoKey = ''
  let submitting = false
  let errors: Record<keyof Publisher, string[]> | null = null

  const dispatch = createEventDispatcher<{ submit: Publisher }>()

  const submit: FormEventHandler<HTMLFormElement> = async (e) => {
    submitting = true

    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Omit<Publisher, 'icon'>>
    if (!json.success) return (errors = json.errors)

    dispatch('submit', { ...json.data, logo: logoKey })
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
        <h2 class="text-base font-semibold">Add Publisher</h2>
      </Dialog.Title>

      <form
        action="/api/publisher?add"
        method="post"
        class="space-y-4"
        on:submit|preventDefault={submit}
      >
        <FileDropzone name="logo" error={errors?.logo} bind:key={logoKey} />

        <Field label="Name" error={errors?.name}>
          <input
            type="text"
            name="name"
            class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
            shadow-sm focus:outline-slate-900"
            class:border-red-500={!!errors?.name}
          />
        </Field>

        <Field label="Country" error={errors?.country_id}>
          <CountrySelect error={errors?.country_id} />
        </Field>

        <Field label="Info" error={errors?.info}>
          <textarea
            name="info"
            class="border w-full px-3 py-1.5 rounded-md text-sm
            shadow-sm focus:outline-slate-900 h-20"
            class:border-red-500={!!errors?.info}
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
