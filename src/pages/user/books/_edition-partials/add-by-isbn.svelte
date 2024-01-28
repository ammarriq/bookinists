<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { ISBNBook } from '@/lib/types'
  import type { Edition } from '@/pages/api/edition'

  import { createEventDispatcher } from 'svelte'
  import { toast } from 'svelte-sonner'
  import Field from '@/components/field.svelte'

  export let dialogOpen: boolean
  export let book_id = ''

  const dispatch = createEventDispatcher<{ submit: Edition }>()

  let edition: ISBNBook | null = null
  let submitting = false
  let errors: Record<keyof Edition, string[]> | null = null

  const getBookByISBN: FormEventHandler<HTMLFormElement> = async (e) => {
    const isbnValue = String(e.currentTarget.isbn.value)

    if (!isbnValue.trim()) {
      return alert('Please provide valid ISBN')
    }

    submitting = true

    const res = await fetch(`/api/isbn?value=${isbnValue}`)
    const json = (await res.json()) as FetchResponse<ISBNBook>

    if (!json.success) {
      const error = json.errors.message?.join(', ')
      return toast.error(error || 'Something went wrong. Try again later.')
    }

    edition = json.data
    submitting = false
  }

  const submit: FormEventHandler<HTMLFormElement> = async (e) => {
    submitting = true

    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Edition>
    if (!json.success) return (errors = json.errors)

    dispatch('submit', json.data)
    dialogOpen = false
  }

  $: console.log(edition)
</script>

<form on:submit|preventDefault={getBookByISBN}>
  <Field label="ISBN">
    <div class="flex items-center">
      <input
        type="number"
        name="isbn"
        class="border w-full px-3 py-1.5 rounded-l-md text-sm
        shadow-sm focus:outline-slate-900"
      />
      <button
        class="flex items-center justify-center text-sm text-white
        font-medium px-4 py-1.5 rounded-r-md border
        border-slate-900 bg-slate-900 hover:bg-slate-900/90
        disabled:bg-slate-900/50 disabled:!border-slate-900/30"
        disabled={submitting}
      >
        {#if submitting}
          <i class="icon-[tabler--loader-2] shrink-0 animate-spin mr-1.5" />
        {/if}
        Submit
      </button>
    </div>
  </Field>
</form>

{#if submitting}
  <div class="text-center mt-4">
    <i class="icon-[tabler--loader-2] animate-spin duration-300 size-6" />
  </div>
{/if}

{#if !submitting && edition}
  <form
    action="/api/edition?add_by_isbn"
    method="post"
    class="mt-4 grid grid-cols-2 gap-4"
    on:submit|preventDefault={submit}
  >
    {#if edition.imageLinks?.thumbnail}
      <img
        class="col-span-2 mx-auto"
        src={edition.imageLinks.thumbnail}
        alt={edition.title}
      />
    {/if}

    <Field label="Pages" error={errors?.pages}>
      <input type="hidden" name="pages" value={edition.pageCount ?? 0} />
      <p class="text-sm text-slate-600/90">{edition.pageCount}</p>
    </Field>

    <Field label="Language" error={errors?.language_iso}>
      <input type="hidden" name="language_iso" value={edition.language} />
      <p class="text-sm text-slate-600/90">{edition.language}</p>
    </Field>

    {#each edition.industryIdentifiers as isbn, i (i)}
      {@const isbnName = isbn.type.toLowerCase().replace('_', '')}
      <Field label={isbn.type.replace('_', '-')}>
        <input type="hidden" name={isbnName} value={isbn.identifier} />
        <p class="text-sm text-slate-600/90">{isbn.identifier}</p>
      </Field>
    {/each}

    <Field label="Published date" error={errors?.publisher_id}>
      <input
        type="hidden"
        name="date"
        value={new Date(edition.publishedDate).getTime()}
      />
      <p class="text-sm text-slate-600/90">{edition.publishedDate}</p>
    </Field>

    <Field label="Publisher">
      <input type="hidden" name="publisher" value={edition.publisher} />
      <p class="text-sm text-slate-600/90">{edition.publisher}</p>
    </Field>

    <input
      type="hidden"
      name="thumbnail"
      value={edition.imageLinks?.thumbnail}
    />
    <input type="hidden" name="book_id" value={book_id} />

    <button
      class="flex items-center justify-center text-sm text-white font-medium
      px-4 py-1.5 rounded-md ml-auto mt-4 bg-slate-900 col-span-2
      hover:bg-slate-900/90 disabled:bg-slate-900/50"
      disabled={submitting}
    >
      {#if submitting}
        <i class="icon-[tabler--loader-2] shrink-0 animate-spin mr-1.5" />
      {/if}
      Submit
    </button>
  </form>
{/if}
