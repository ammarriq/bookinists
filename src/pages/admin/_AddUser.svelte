<script lang="ts">
  import { Dialog } from 'bits-ui'
  import { fade, fly } from 'svelte/transition'

  let dialogOpen = false
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
      -translate-y-1/2 rounded-md border bg-white p-5 outline-none"
    >
      <button
        class="icon-[tabler--x] absolute top-4 right-4"
        on:click={() => (dialogOpen = false)}
      />

      <Dialog.Title class="space-y-1 mb-8">
        <h2 class="text-base font-semibold">Add User</h2>
        <p class="text-sm text-gray-500/70">
          Provide both name and email to create a new user.
        </p>
      </Dialog.Title>

      <form method="post">
        <label class="flex gap-4 items-center justify-between mt-4">
          <span class="text-sm font-medium">Email</span>
          <input
            required
            type="email"
            name="email"
            class="border w-full px-3 py-1.5 rounded-md text-sm
            shadow-sm focus:outline-violet-600 max-w-[16rem]"
          />
        </label>

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
