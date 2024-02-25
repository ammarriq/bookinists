<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { Book } from '@/pages/api/book/index'

  import { createEventDispatcher } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import { Dialog, Select, DropdownMenu as Dropdown } from 'bits-ui'
  import { clickParent } from '@/lib/actions'
  import { read_status } from '@/lib/constants'
  import Field from '@/components/field.svelte'
  import BookAuthor from './book_author.svelte'

  export let book: Book

  let submitting = false
  let editDialog = false
  let authorDialog = false

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

    editDialog = false
    dispatch('edit', json.data)
  }

  const updateAuthors: FormEventHandler<HTMLFormElement> = async (e) => {
    submitting = true

    const form = e.currentTarget
    const formData = new FormData(form)

    await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    authorDialog = false
  }

  const deleteBook = async () => {
    if (!confirm('Are you sure you wanna delete the book?')) return
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
      on:click={() => (editDialog = true)}
    >
      Edit
    </Dropdown.Item>
    <Dropdown.Item
      class="text-left w-full px-3 py-1.5 rounded-md hover:bg-slate-100"
      on:click={() => (authorDialog = true)}
    >
      Authors
    </Dropdown.Item>
    <Dropdown.Item
      class="text-left w-full px-3 py-1.5 rounded-md hover:bg-slate-100"
      on:click={deleteBook}
      disabled={submitting}
    >
      <form
        action="/api/book?delete"
        method="post"
        bind:this={deleteForm}
        on:submit|preventDefault
      >
        <input type="hidden" name="id" value={book.id} />
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
          <h2 class="text-base font-semibold">Edit Book</h2>
        </Dialog.Title>

        <form
          action="/api/book?edit"
          method="post"
          class="space-y-4"
          on:submit|preventDefault={editBook}
        >
          <Field label="Title" error={errors?.title}>
            <input
              type="text"
              name="title"
              class="border w-full px-3 py-1.5 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.title}
              value={book.title}
            />
          </Field>

          <Field label="URL" error={errors?.url}>
            <input
              type="text"
              name="url"
              class="border w-full px-3 py-1.5 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.url}
              value={book.url}
            />
          </Field>

          <Field label="Excerpt" error={errors?.excerpt}>
            <input
              type="text"
              name="excerpt"
              class="border w-full px-3 py-1.5 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.excerpt}
              value={book.excerpt}
            />
          </Field>

          <Field label="Read status" error={errors?.read_status}>
            <Select.Root
              portal=".dialog"
              selected={read_status
                .map((o) => ({ value: o, label: o }))
                .find((o) => o.value === book.read_status)}
            >
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

          <Field label="Rating" error={errors?.rating}>
            <input
              type="number"
              name="rating"
              class="border w-full px-3 py-1.5 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.rating}
              value={book.rating}
            />
          </Field>

          <Field label="Review" error={errors?.review}>
            <input
              type="text"
              name="review"
              class="border w-full px-3 py-1.5 rounded-md text-sm
              shadow-sm focus:outline-slate-900"
              class:border-red-500={!!errors?.review}
              value={book.review}
            />
          </Field>

          <input type="hidden" name="id" value={book.id} />
          <input type="hidden" name="genre_id" value={book.genre_id} />

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

<Dialog.Root bind:open={authorDialog}>
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
        use:clickParent={() => (authorDialog = false)}
      >
        <button
          class="icon-[tabler--x] absolute top-4 right-4"
          on:click={() => (authorDialog = false)}
        />

        <Dialog.Title class="space-y-1 mb-4">
          <h2 class="text-base font-semibold">Edit Book</h2>
        </Dialog.Title>

        <form
          action="/api/book/authors?update"
          method="post"
          class="space-y-4"
          on:submit|preventDefault={updateAuthors}
        >
          <div>
            <p class="text-sm font-medium mb-0.5">Author</p>
            <BookAuthor book_id={book.id} />
          </div>
          <input type="hidden" name="book_id" value={book.id} />

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
