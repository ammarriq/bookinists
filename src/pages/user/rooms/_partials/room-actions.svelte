<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { Room } from '@/pages/api/room'

  import { fade, fly } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import { Dialog, DropdownMenu as Dropdown } from 'bits-ui'
  import Field from '@/components/field.svelte'
  import { clickParent } from '@/lib/actions'
  import MultiSelectStorage from './multi_select_storage.svelte'

  export let room: Room

  let submitting = false
  let editDialog = false
  let storageDialog = false

  let deleteForm: HTMLFormElement
  let errors: Record<keyof Room, string[]> | null = null

  const dispatch = createEventDispatcher<{
    edit: Room
    delete: string
  }>()

  const editRoom: FormEventHandler<HTMLFormElement> = async (e) => {
    submitting = true

    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Room>

    if (!json.success) return (errors = json.errors)

    editDialog = false
    dispatch('edit', json.data)
  }

  const updateStorages: FormEventHandler<HTMLFormElement> = async (e) => {
    submitting = true

    const form = e.currentTarget
    const formData = new FormData(form)

    await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    storageDialog = false
  }

  const deleteRoom = async () => {
    if (!confirm('Are you sure you wanna delete the room?')) return
    submitting = true

    const form = deleteForm
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Room>
    if (!json.success) return (errors = json.errors)

    dispatch('delete', room.id)
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
      on:click={() => (storageDialog = true)}
    >
      Storages
    </Dropdown.Item>
    <Dropdown.Item
      class="text-left w-full px-3 py-1.5 rounded-md hover:bg-slate-100"
      on:click={deleteRoom}
      disabled={submitting}
    >
      <form
        action="/api/room?delete"
        method="post"
        bind:this={deleteForm}
        on:submit|preventDefault
      >
        <input type="hidden" name="id" value={room.id} />
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
      transition={(node) => fly(node, { y: '10px', duration: 150 })}
      class="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2
      -translate-y-1/2 rounded-md border bg-white py-5 px-6 outline-none"
    >
      <button
        class="icon-[tabler--x] absolute top-4 right-4"
        on:click={() => (editDialog = false)}
      />

      <Dialog.Title class="space-y-1 mb-4">
        <h2 class="text-base font-semibold">Edit Room</h2>
      </Dialog.Title>

      <form
        action="/api/room?edit"
        method="post"
        class="space-y-4"
        on:submit|preventDefault={editRoom}
      >
        <input type="hidden" name="id" value={room.id} />

        <Field label="Name" error={errors?.name}>
          <input
            type="text"
            name="name"
            class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
            shadow-sm focus:outline-slate-900"
            class:border-red-500={!!errors?.name}
            value={room.name}
          />
        </Field>

        <Field label="Floor" error={errors?.floor}>
          <input
            type="number"
            name="floor"
            class="border w-full px-3 py-1.5 h-8 rounded-md text-sm
            shadow-sm focus:outline-slate-900"
            class:border-red-500={!!errors?.floor}
            value={room.floor}
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

<Dialog.Root bind:open={storageDialog}>
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
        use:clickParent={() => (storageDialog = false)}
      >
        <button
          class="icon-[tabler--x] absolute top-4 right-4"
          on:click={() => (storageDialog = false)}
        />

        <Dialog.Title class="space-y-1 mb-4">
          <h2 class="text-base font-semibold">Update Storages</h2>
        </Dialog.Title>

        <form
          action="/api/room/storages?update"
          method="post"
          class="space-y-4"
          on:submit|preventDefault={updateStorages}
        >
          <div>
            <p class="text-sm font-medium mb-0.5">Storage</p>
            <MultiSelectStorage room_id={room.id} />
          </div>
          <input type="hidden" name="room_id" value={room.id} />

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
