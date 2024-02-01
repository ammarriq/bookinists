<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'

  import { fade, fly } from 'svelte/transition'
  import { Dialog } from 'bits-ui'
  import dayjs from 'dayjs'
  import Field from '@/components/field.svelte'
  import FileDropzone from '@/components/file-dropzone.svelte'

  type Purchase = {
    purchase_price: number
    purchase_date: number
    purchase_invoice: string
  }

  export let edition_id: string
  export let purchase_invoice = ''
  export let purchase_price = 0
  export let purchase_date = 0

  let dialogOpen = false
  let submitting = false
  let errors: Record<keyof Purchase, string[]> | null = null

  const submit: FormEventHandler<HTMLFormElement> = async (e) => {
    submitting = true

    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Purchase>

    if (!json.success) return (errors = json.errors)

    dialogOpen = false
  }
</script>

<div class="grid gap-y-4 pb-6 px-6 rounded-md bg-white mt-6">
  <hgroup class="flex items-center justify-between py-4 border-b">
    <h3 class="font-medium">Purchase</h3>
    <button
      class="icon-[tabler--circle-plus] size-5"
      on:click={() => (dialogOpen = true)}
    />
  </hgroup>

  <ul class="space-y-3">
    <Field label="Price">
      <input
        type="number"
        name="purchase_price"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={purchase_price}
      />
    </Field>

    <Field label="Purchase date">
      <input
        type="number"
        name="purchase_date"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={dayjs(purchase_date).format('YYYY-MM-DD')}
      />
    </Field>
  </ul>
</div>

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
        <h2 class="text-base font-semibold">Upload Invoice</h2>
      </Dialog.Title>

      <form
        action="/api/thumbnail?add"
        method="post"
        class="space-y-4"
        on:submit|preventDefault={submit}
      >
        <input type="hidden" name="edition_id" value={edition_id} />
        <FileDropzone
          name="image"
          error={errors?.purchase_invoice}
          bind:key={purchase_invoice}
        />

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
