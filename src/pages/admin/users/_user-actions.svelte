<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { User } from '@/lib/auth'

  import { fade, fly } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import { Dialog, Select, DropdownMenu as Dropdown } from 'bits-ui'

  export let id: string
  export let email: string
  export let role: string

  let dialogOpen = false
  let errors: Record<string, string[]> = {}

  const dispatch = createEventDispatcher<{ edit: User; delete: string }>()

  const editUser: FormEventHandler<HTMLFormElement> = async (e) => {
    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: 'PUT',
      body: formData,
    })

    const json = (await res.json()) as FetchResponse<User>
    if (!json.success) return (errors = json.errors)

    dialogOpen = false
    dispatch('edit', json.data)
  }

  const deleteUser = async () => {
    if (!confirm('Are you sure you wanna delete the user?')) return

    const res = await fetch('/api/user', {
      method: 'DELETE',
      body: id,
    })

    const json = (await res.json()) as FetchResponse<User>
    if (!json.success) return (errors = json.errors)

    dispatch('delete', id)
  }

  const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
  ]
</script>

<Dropdown.Root>
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
      on:click={deleteUser}
    >
      Delete
    </Dropdown.Item>
  </Dropdown.Content>
</Dropdown.Root>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Portal>
    <Dialog.Overlay
      transition={(node) => fade(node, { duration: 150 })}
      class="fixed inset-0 bg-black/60"
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
        <h2 class="text-base font-semibold">Add User</h2>
        <p class="text-sm text-slate-500/70">
          Provide both name and email to create a new user.
        </p>
      </Dialog.Title>

      <form action="/api/user" on:submit|preventDefault={editUser}>
        <label for="email" class="text-sm font-medium"> Email </label>
        <input type="hidden" name="id" value={id} />
        <div class="relative w-full mt-0.5">
          {#if !!errors.email}
            <small class="text-sm absolute top-full left-0 text-red-500">
              {errors.email}
            </small>
          {/if}
          <input
            disabled
            type="email"
            id="email"
            name="email"
            value={email}
            class="border w-full px-3 py-1.5 rounded-md
            text-sm focus:outline-slate-900"
            class:border-red-500={!!errors.email}
          />
        </div>

        <div class="flex gap-4 roles-center justify-between mt-4">
          <span class="text-sm font-medium">Role</span>
        </div>

        <div class="relative mt-0.5">
          {#if !!errors.role}
            <small class="text-sm absolute top-full left-0 text-red-500">
              {errors.role}
            </small>
          {/if}
          <Select.Root selected={roles.find((o) => o.value === role)}>
            <Select.Trigger
              class="flex items-center justify-between border w-full px-3
              py-1.5 rounded-md text-sm shadow-sm focus:outline-slate-900
              {!!errors.role ? 'border-red-500' : ''}"
              aria-label="Select a theme"
            >
              <Select.Value
                class="text-sm first-letter:capitalize"
                placeholder="Select a theme"
              />
              <Select.Input name="role" />
              <i class="icon-[tabler--selector]" />
            </Select.Trigger>
            <Select.Content
              class="w-full rounded-md p-1 border bg-white shadow-sm"
              transition={(e) => fly(e, { duration: 150, y: -5 })}
              sideOffset={8}
            >
              {#each roles as role}
                <Select.Item
                  class="px-2 py-1 text-sm capitalize rounded-md cursor-default hover:bg-slate-100"
                  value={role.value}
                  label={role.label}
                >
                  {role.label}
                </Select.Item>
              {/each}
            </Select.Content>
            <Select.Input name="favoriteFruit" />
          </Select.Root>
        </div>

        <button
          class="flex ml-auto gap-1 text-sm text-white font-medium
          hover:bg-slate-900/90 bg-slate-900 rounded-md px-4 py-1.5 mt-4"
        >
          Submit
        </button>
      </form>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
