<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { Location } from '@/pages/api/location'

  import { fade, fly } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import { Dialog, DropdownMenu as Dropdown } from 'bits-ui'
  import { clickParent } from '@/lib/actions'
  import Field from '@/components/field.svelte'
  import MultiSelectRoom from './multi_select_room.svelte'

  export let location: Location

  let submitting = false
  let editDialog = false
  let roomDialog = false

  let deleteForm: HTMLFormElement
  let errors: Record<keyof Location, string[]> | null = null

  const dispatch = createEventDispatcher<{
    edit: Location
    delete: string
  }>()

  const editLocation: FormEventHandler<HTMLFormElement> = async (e) => {
    submitting = true

    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Location>

    if (!json.success) return (errors = json.errors)

    editDialog = false
    dispatch('edit', json.data)
  }

  const updateRooms: FormEventHandler<HTMLFormElement> = async (e) => {
    submitting = true

    const form = e.currentTarget
    const formData = new FormData(form)

    await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    roomDialog = false
  }

  const deleteLocation = async () => {
    if (!confirm('Are you sure you wanna delete the location?')) return
    submitting = true

    const form = deleteForm
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Location>
    if (!json.success) return (errors = json.errors)

    dispatch('delete', location.id)
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
      on:click={() => (editDialog = true)}
    >
      Edit
    </Dropdown.Item>
    <Dropdown.Item
      class="text-left w-full px-3 py-1.5 rounded-md hover:bg-slate-100"
      on:click={() => (roomDialog = true)}
    >
      Rooms
    </Dropdown.Item>
    <Dropdown.Item
      class="text-left w-full px-3 py-1.5 rounded-md hover:bg-slate-100"
      on:click={deleteLocation}
      disabled={submitting}
    >
      <form
        action="/api/location?delete"
        method="post"
        bind:this={deleteForm}
        on:submit|preventDefault
      >
        <input type="hidden" name="id" value={location.id} />
        <button type="submit" disabled={submitting}>Delete</button>
      </form>
    </Dropdown.Item>
  </Dropdown.Content>
</Dropdown.Root>

<Dialog.Root bind:open={editDialog}>
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
        use:clickParent={() => (editDialog = false)}
      >
        <button
          class="icon-[tabler--x] absolute top-4 right-4"
          on:click={() => (editDialog = false)}
        />

        <Dialog.Title class="space-y-1 mb-4">
          <h2 class="text-base font-semibold">Edit Location</h2>
        </Dialog.Title>

        <form
          action="/api/location?edit"
          method="post"
          class="space-y-4"
          on:submit|preventDefault={editLocation}
        >
          <input type="hidden" name="id" value={location.id} />

          <Field label="Name" error={errors?.name}>
            <input
              type="text"
              name="name"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.name}
              value={location.name}
            />
          </Field>

          <Field label="URL" error={errors?.url}>
            <input
              type="text"
              name="url"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.url}
              value={location.url}
            />
          </Field>

          <Field label="Phone" error={errors?.phone}>
            <input
              type="tel"
              name="phone"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.phone}
              value={location.phone}
            />
          </Field>

          <Field label="Address" error={errors?.address}>
            <input
              type="text"
              name="address"
              class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.address}
              value={location.address}
            />
          </Field>

          <Field label="Notes" error={errors?.notes}>
            <textarea
              name="notes"
              class="border w-full px-3 py-1.5 rounded-md text-sm
              shadow-sm focus:outline-slate-900 h-20"
              class:border-red-500={!!errors?.notes}
              value={location.notes}
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

<Dialog.Root bind:open={roomDialog}>
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
        use:clickParent={() => (roomDialog = false)}
      >
        <button
          class="icon-[tabler--x] absolute top-4 right-4"
          on:click={() => (roomDialog = false)}
        />

        <Dialog.Title class="space-y-1 mb-4">
          <h2 class="text-base font-semibold">Update Rooms</h2>
        </Dialog.Title>

        <form
          action="/api/location/rooms?update"
          method="post"
          class="space-y-4"
          on:submit|preventDefault={updateRooms}
        >
          <div>
            <p class="text-sm font-medium mb-0.5">Rooms</p>
            <MultiSelectRoom location_id={location.id} />
          </div>
          <input type="hidden" name="location_id" value={location.id} />

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
