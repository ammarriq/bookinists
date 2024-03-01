<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { AwardLinking as BookAward } from '@/pages/api/award-linking'

  import { fade, fly } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import { Dialog, DropdownMenu as Dropdown } from 'bits-ui'
  import { clickParent } from '@/lib/actions'
  import Field from '@/components/field.svelte'
  import BookSelect from './select-book.svelte'
  import AwardSelect from './select-award.svelte'
  import AwardCategorySelect from './select-award-category.svelte'

  export let bookAward: BookAward

  let submitting = false
  let dialogOpen = false

  let deleteForm: HTMLFormElement
  let errors: Record<keyof BookAward, string[]> | null = null

  const dispatch = createEventDispatcher<{
    edit: BookAward
    delete: string
  }>()

  const editAward: FormEventHandler<HTMLFormElement> = async (e) => {
    submitting = true

    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<BookAward>

    if (!json.success) return (errors = json.errors)

    dialogOpen = false
    dispatch('edit', json.data)
  }

  const deleteAward = async () => {
    if (!confirm('Are you sure you wanna delete the award?')) return
    submitting = true

    const form = deleteForm
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<BookAward>
    if (!json.success) return (errors = json.errors)

    dispatch('delete', bookAward.id)
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
      on:click={deleteAward}
      disabled={submitting}
    >
      <form
        action="/api/award-category?delete"
        method="post"
        bind:this={deleteForm}
        on:submit|preventDefault
      >
        <input type="hidden" name="id" value={bookAward.id} />
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
      class="fixed inset-0 grid place-items-center
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
          <h2 class="text-base font-semibold">Edit Award</h2>
        </Dialog.Title>

        <form
          action="/api/award-linking?edit"
          method="post"
          class="space-y-4"
          on:submit|preventDefault={editAward}
        >
          <input type="hidden" name="id" value={bookAward.id} />

          <Field label="Book" error={errors?.book_id}>
            <BookSelect book_id={bookAward.book_id} />
          </Field>

          <Field label="Award" error={errors?.award_id}>
            <AwardSelect award_id={bookAward.award_id} />
          </Field>

          <Field label="Award category" error={errors?.award_category_id}>
            <AwardCategorySelect
              award_category_id={bookAward.award_category_id}
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
