<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { Book } from '@/pages/api/book'

  import { fade, fly } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import { Dialog, Select } from 'bits-ui'
  import { clickParent } from '@/lib/actions'
  import { read_status } from '@/lib/constants'
  import Field from '@/components/field.svelte'
  import Button from '@/components/button.svelte'

  let submitting = false
  let dialogOpen = false

  let deleteForm: HTMLFormElement
  let errors: Record<keyof Book, string[]> | null = null

  const dispatch = createEventDispatcher<{ edit: Book; delete: string }>()

  const editBook: FormEventHandler<HTMLFormElement> = async (e) => {
    submitting = true

    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Book>
    if (!json.success) return (errors = json.errors)

    dialogOpen = false
    dispatch('edit', json.data)
  }

  const deleteBook = async () => {
    if (!confirm('Are you sure you wanna delete selected books?')) return
    submitting = true

    const form = deleteForm
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Book>
    if (!json.success) return (errors = json.errors)

    dispatch('delete', json.data.id)
  }
</script>

<Button class="py-1.5 px-2" on:click={() => (dialogOpen = true)}>
  <i class="icon-[tabler--send] size-4" />
</Button>

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
          <h2 class="text-base font-semibold">Move Books</h2>
        </Dialog.Title>

        <form
          action="/api/book?edit"
          method="post"
          class="space-y-4"
          on:submit|preventDefault={editBook}
        >
          <Field label="Read status" error={errors?.read_status}>
            <Select.Root portal=".dialog">
              <Select.Trigger
                class="flex items-center justify-between border w-full px-3
                py-1.5 rounded-md text-sm  shadow-sm focus:outline-slate-900
                {!!errors?.read_status ? 'border-red-500' : ''}"
                aria-label="Select a status"
              >
                <Select.Value
                  class="text-sm first-letter:capitalize"
                  placeholder="Select a status"
                />
                <Select.Input name="read_status" />
                <i class="icon-[tabler--selector]" />
              </Select.Trigger>
              <Select.Content
                class="w-full rounded-md p-1 border bg-white  shadow-sm z-40"
                transition={(e) => fly(e, { duration: 150, y: -5 })}
                sideOffset={8}
              >
                {#each read_status as role}
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
