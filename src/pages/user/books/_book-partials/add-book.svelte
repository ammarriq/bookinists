<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import { Dialog } from 'bits-ui'
  import { clickParent } from '@/lib/actions'
  import AddByManual from './add-by-manual.svelte'
  import AddByIsbn from './add-by-isbn.svelte'

  export let dialogOpen = false

  let tab = 'manual'
</script>

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

        <Dialog.Title class="space-y-1">
          <h2 class="text-base font-semibold">Add Book</h2>
        </Dialog.Title>

        <div class="flex border rounded-md shadow-sm my-4">
          <button
            on:click={(e) => (tab = e.currentTarget.value)}
            value="manual"
            class="grow text-sm font-medium p-2 rounded-md
            {tab === 'manual' ? 'text-white bg-amber-300' : ''}"
          >
            Manual
          </button>
          <button
            on:click={(e) => (tab = e.currentTarget.value)}
            value="isbn"
            class="grow text-sm font-medium p-2 rounded-md
            {tab === 'isbn' ? 'text-white bg-amber-300' : ''}"
          >
            ISBN
          </button>
        </div>

        {#if tab === 'manual'}
          <AddByManual bind:dialogOpen on:submit />
        {/if}

        {#if tab === 'isbn'}
          <AddByIsbn bind:dialogOpen on:submit />
        {/if}
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
