<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { AwardLinking as BookAward } from '@/pages/api/award-linking'

  import { fade, fly } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import { Dialog } from 'bits-ui'
  import { clickParent } from '@/lib/actions'
  import Field from '@/components/field.svelte'
  import BookSelect from './select-book.svelte'
  import AwardSelect from './select-award.svelte'
  import AwardCategorySelect from './select-award-category.svelte'

  export let dialogOpen = false

  let submitting = false
  let errors: Record<keyof BookAward, string[]> | null = null

  const dispatch = createEventDispatcher<{ submit: BookAward }>()

  const submit: FormEventHandler<HTMLFormElement> = async (e) => {
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

    dispatch('submit', json.data)
    dialogOpen = false
  }
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

        <Dialog.Title class="space-y-1 mb-4">
          <h2 class="text-base font-semibold">Add Category</h2>
        </Dialog.Title>

        <form
          action="/api/award-linking?add"
          method="post"
          class="space-y-4"
          on:submit|preventDefault={submit}
        >
          <Field label="Book" error={errors?.book_id}>
            <BookSelect />
          </Field>

          <Field label="Award" error={errors?.award_id}>
            <AwardSelect />
          </Field>

          <Field label="Award category" error={errors?.award_category_id}>
            <AwardCategorySelect />
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
