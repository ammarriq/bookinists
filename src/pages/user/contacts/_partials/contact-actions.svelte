<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { Contact } from '@/pages/api/contact'

  import { fade, fly } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import { Dialog, DropdownMenu as Dropdown, Select, Switch } from 'bits-ui'
  import { favorite_contact } from '@/lib/constants'
  import { clickParent } from '@/lib/actions'
  import Field from '@/components/field.svelte'
  import FileDropzone from '@/components/file-dropzone.svelte'
  import CountrySelect from '../../_country-select.svelte'

  export let contact: Contact

  let avatarKey = contact.avatar
  let submitting = false
  let dialogOpen = false

  let deleteForm: HTMLFormElement
  let errors: Record<keyof Contact, string[]> | null = null

  const dispatch = createEventDispatcher<{
    edit: Contact
    delete: string
  }>()

  const editContact: FormEventHandler<HTMLFormElement> = async (e) => {
    submitting = true

    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Omit<Contact, 'avatar'>>

    if (!json.success) return (errors = json.errors)

    dialogOpen = false
    dispatch('edit', { ...json.data, avatar: avatarKey })
  }

  const deleteContact = async () => {
    if (!confirm('Are you sure you wanna delete the contact?')) return
    submitting = true

    const form = deleteForm
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Contact>
    if (!json.success) return (errors = json.errors)

    dispatch('delete', contact.id)
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
      on:click={deleteContact}
      disabled={submitting}
    >
      <form
        action="/api/contact?delete"
        method="post"
        bind:this={deleteForm}
        on:submit|preventDefault
      >
        <input type="hidden" name="id" value={contact.id} />
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
          <h2 class="text-base font-semibold">Edit Contact</h2>
        </Dialog.Title>

        <form
          action="/api/contact?edit"
          method="post"
          class="space-y-4"
          on:submit|preventDefault={editContact}
        >
          <input type="hidden" name="id" value={contact.id} />

          <FileDropzone
            name="avatar"
            error={errors?.avatar}
            status={avatarKey ? 'resolved' : 'idle'}
            bind:key={avatarKey}
          />

          <Field label="Name" error={errors?.name}>
            <input
              type="text"
              name="name"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.name}
              value={contact.name}
            />
          </Field>

          <Field label="Currency" error={errors?.currency}>
            <input
              type="text"
              name="currency"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.currency}
              value={contact.currency}
            />
          </Field>

          <Field label="Paypal email" error={errors?.paypal_email}>
            <input
              type="text"
              name="paypal_email"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.paypal_email}
              value={contact.paypal_email}
            />
          </Field>

          <Field label="Email" error={errors?.email}>
            <input
              type="email"
              name="email"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.email}
              value={contact.email}
            />
          </Field>

          <Field label="Phone" error={errors?.phone}>
            <input
              type="text"
              name="phone"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.phone}
              value={contact.phone}
            />
          </Field>

          <Field label="URL" error={errors?.url}>
            <input
              type="text"
              name="url"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.url}
              value={contact.url}
            />
          </Field>

          <Field label="Bank information" error={errors?.bank_info}>
            <input
              type="text"
              name="bank_info"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.bank_info}
              value={contact.bank_info}
            />
          </Field>

          <Field label="Rating" error={errors?.rating}>
            <input
              type="number"
              name="rating"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.rating}
              value={contact.rating}
            />
          </Field>

          <Field label="Favorite contact" error={errors?.favorite_contact}>
            <Select.Root
              portal=".dialog"
              selected={favorite_contact
                .map((o) => ({ value: o, label: o }))
                .find((o) => o.value === contact.favorite_contact)}
            >
              <Select.Trigger
                class="flex items-center justify-between border w-full px-3
                py-1.5 rounded-md text-sm shadow-sm focus:outline-slate-900
                {!!errors?.favorite_contact ? 'border-red-500' : ''}"
                aria-label="Select a type"
              >
                <Select.Value
                  class="text-sm first-letter:capitalize"
                  placeholder="Select a storage type"
                />
                <Select.Input name="favorite_contact" />
                <i class="icon-[tabler--selector]" />
              </Select.Trigger>
              <Select.Content
                class="w-full rounded-md p-1 border bg-white shadow-sm z-40"
                transition={(e) => fly(e, { duration: 150, y: -5 })}
                sideOffset={8}
              >
                {#each favorite_contact as role}
                  <Select.Item
                    class="px-2 py-1 text-sm capitalize rounded-md cursor-default hover:bg-slate-100"
                    value={role}
                    label={role}
                  >
                    {role}
                  </Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </Field>

          <Field label="Country" error={errors?.country_id}>
            <CountrySelect
              error={errors?.country_id}
              country_id={contact.country_id ?? ''}
            />
          </Field>

          <p class="text-sm font-medium">Select the items which apply:</p>

          <fieldset class="space-y-2 !mt-1 border p-3 shadow-sm rounded-md">
            <Field
              label="Whatsapp"
              class="flex items-center gap-2 flex-row-reverse !space-y-0 max-w-max"
              error={errors?.use_whatsapp}
            >
              <Switch.Root
                checked={!!contact.use_whatsapp}
                class="flex items-center justify-center border rounded-md shadow
                {!!errors?.use_whatsapp ? 'border-red-500' : ''} size-4"
              >
                <Switch.Input class="peer" name="use_whatsapp" />
                <i
                  class="icon-[tabler--square-rounded-check-filled]
                  shrink-0 size-[1.125rem] hidden peer-checked:block"
                />
              </Switch.Root>
            </Field>

            <Field
              label="Signal"
              class="flex items-center gap-2 flex-row-reverse !space-y-0 max-w-max"
              error={errors?.use_signal}
            >
              <Switch.Root
                checked={!!contact.use_signal}
                class="flex items-center justify-center border rounded-md shadow
                {!!errors?.use_signal ? 'border-red-500' : ''} size-4"
              >
                <Switch.Input class="peer" name="use_signal" />
                <i
                  class="icon-[tabler--square-rounded-check-filled]
                  shrink-0 size-[1.125rem] hidden peer-checked:block"
                />
              </Switch.Root>
            </Field>

            <Field
              label="Professional"
              class="flex items-center gap-2 flex-row-reverse !space-y-0 max-w-max"
              error={errors?.is_professional}
            >
              <Switch.Root
                checked={!!contact.is_professional}
                class="flex items-center justify-center border rounded-md shadow
                {!!errors?.is_professional ? 'border-red-500' : ''} size-4"
              >
                <Switch.Input class="peer" name="is_professional" />
                <i
                  class="icon-[tabler--square-rounded-check-filled]
                  shrink-0 size-[1.125rem] hidden peer-checked:block"
                />
              </Switch.Root>
            </Field>
          </fieldset>

          <Field label="Note" error={errors?.note}>
            <textarea
              name="note"
              class="border w-full px-3 py-1.5 rounded-md text-sm
              shadow-sm focus:outline-slate-900 h-20"
              class:border-red-500={!!errors?.note}
              value={contact.note}
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
