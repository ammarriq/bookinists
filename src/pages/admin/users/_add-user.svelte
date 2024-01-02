<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { User } from '@/lib/auth'
  import { fade, fly } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import { Dialog, Select } from 'bits-ui'

  let dialogOpen = false
  let errors: Record<string, string[]> = {}

  const dispatch = createEventDispatcher<{ submit: User }>()

  const submit: FormEventHandler<HTMLFormElement> = async (e) => {
    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    const json = (await res.json()) as {
      data: User
      success: boolean
      errors: typeof errors
    }

    if (!json.success) return (errors = json.errors)

    dispatch('submit', json.data)
    dialogOpen = false
  }
</script>

<button
  on:click={() => (dialogOpen = true)}
  class="flex items-center gap-1 text-xs text-white
  hover:bg-violet-600/90 bg-violet-600 rounded px-4 py-2"
>
  <i class="icon-[tabler--plus]" />
  <span>Add user</span>
</button>

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

      <Dialog.Title class="space-y-1 mb-6">
        <h2 class="text-base font-semibold">Add User</h2>
        <p class="text-sm text-gray-500/70">
          Provide both name and email to create a new user.
        </p>
      </Dialog.Title>

      <form
        action="/api/user/add"
        method="post"
        on:submit|preventDefault={submit}
      >
        <label for="email" class="text-sm font-medium"> Email </label>
        <div class="relative w-full mt-0.5">
          {#if !!errors.email}
            <small class="text-xs absolute top-full left-0 text-red-500">
              {errors.email}
            </small>
          {/if}
          <input
            type="email"
            id="email"
            name="email"
            class="border w-full px-3 py-1.5 rounded-md text-sm
            shadow-sm focus:outline-violet-600"
            class:border-red-500={!!errors.email}
          />
        </div>

        <div class="flex gap-4 items-center justify-between mt-4">
          <span class="text-sm font-medium">Role</span>
        </div>

        <div class="relative mt-0.5">
          {#if !!errors.role}
            <small class="text-xs absolute top-full left-0 text-red-500">
              {errors.role}
            </small>
          {/if}
          <Select.Root>
            <Select.Trigger
              class="flex items-center justify-between border w-full px-3
              py-1.5 rounded-md text-sm shadow-sm focus:outline-violet-600
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
              {#each ['admin', 'manager'] as role}
                <Select.Item
                  class="px-2 py-1 text-sm capitalize rounded-md cursor-default hover:bg-gray-100"
                  value={role}
                  label={role}
                >
                  {role}
                </Select.Item>
              {/each}
            </Select.Content>
            <Select.Input name="favoriteFruit" />
          </Select.Root>
        </div>

        <button
          class="flex items-center gap-1 text-xs text-white ml-auto
          hover:bg-violet-600/90 bg-violet-600 rounded px-4 py-2 mt-8"
        >
          <i class="icon-[tabler--plus]"></i>
          Submit
        </button>
      </form>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
