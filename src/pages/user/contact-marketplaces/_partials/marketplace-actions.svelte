<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { Marketplace } from '@/pages/api/contact-marketplace'

  import { fade, fly } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import { Dialog, DropdownMenu as Dropdown } from 'bits-ui'
  import Field from '@/components/field.svelte'
  import ContactSelect from './select-contact.svelte'
  import MarketplaceSelect from './select-marketplace.svelte'

  export let marketplace: Marketplace

  let submitting = false
  let dialogOpen = false

  let deleteForm: HTMLFormElement
  let errors: Record<keyof Marketplace, string[]> | null = null

  const dispatch = createEventDispatcher<{
    edit: Marketplace
    delete: string
  }>()

  const editMarkeplace: FormEventHandler<HTMLFormElement> = async (e) => {
    submitting = true

    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Omit<Marketplace, 'icon'>>

    if (!json.success) return (errors = json.errors)

    dialogOpen = false
    dispatch('edit', json.data)
  }

  const deleteMarketplace = async () => {
    if (!confirm('Are you sure you wanna delete the marketplace?')) return
    submitting = true

    const form = deleteForm
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Marketplace>
    if (!json.success) return (errors = json.errors)

    dispatch('delete', marketplace.id)
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
      on:click={deleteMarketplace}
      disabled={submitting}
    >
      <form
        action="/api/contact-marketplace?delete"
        method="post"
        bind:this={deleteForm}
        on:submit|preventDefault
      >
        <input type="hidden" name="id" value={marketplace.id} />
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
      class="dialog fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2
      -translate-y-1/2 rounded-md border bg-white py-5 px-6 outline-none"
    >
      <button
        class="icon-[tabler--x] absolute top-4 right-4"
        on:click={() => (dialogOpen = false)}
      />

      <Dialog.Title class="space-y-1 mb-4">
        <h2 class="text-base font-semibold">Add Marketplace</h2>
      </Dialog.Title>

      <form
        action="/api/contact-marketplace?edit"
        method="post"
        class="space-y-4"
        on:submit|preventDefault={editMarkeplace}
      >
        <input type="hidden" name="id" value={marketplace.id} />

        <Field label="Name" error={errors?.name}>
          <input
            type="text"
            name="name"
            class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
            shadow-sm focus:outline-slate-900"
            class:border-red-500={!!errors?.name}
            value={marketplace.name}
          />
        </Field>

        <Field label="URL" error={errors?.shop_url}>
          <input
            type="text"
            name="shop_url"
            class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
            shadow-sm focus:outline-slate-900"
            class:border-red-500={!!errors?.shop_url}
            value={marketplace.shop_url}
          />
        </Field>

        <Field label="Contact" error={errors?.contact_id}>
          <ContactSelect contact_id={marketplace.contact_id} />
        </Field>

        <Field label="Marketplace" error={errors?.marketplace_id}>
          <MarketplaceSelect marketplace_id={marketplace.marketplace_id} />
        </Field>

        <Field label="Description" error={errors?.description}>
          <textarea
            name="description"
            class="border w-full px-3 py-1.5 rounded-md text-sm
            shadow-sm focus:outline-slate-900 h-20"
            class:border-red-500={!!errors?.description}
            value={marketplace.description}
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
