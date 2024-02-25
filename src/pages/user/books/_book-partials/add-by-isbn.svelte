<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { ISBNBook } from '@/lib/types'
  import type { Book } from '@/pages/api/book/index'

  import { createEventDispatcher } from 'svelte'
  import { toast } from 'svelte-sonner'
  import Field from '@/components/field.svelte'

  export let dialogOpen: boolean

  const dispatch = createEventDispatcher<{ submit: Book }>()

  let book: ISBNBook | null = null
  let submitting = false
  let errors: Record<keyof Book, string[]> | null = null

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

    book = json.data
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
    const json = (await res.json()) as FetchResponse<Book>
    if (!json.success) return (errors = json.errors)

    dispatch('submit', json.data)
    dialogOpen = false
  }

  $: console.log(book)
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

{#if !submitting && book}
  <form
    action="/api/book?add_by_isbn"
    method="post"
    class="mt-4 grid grid-cols-2 gap-4"
    on:submit|preventDefault={submit}
  >
    {#if book.imageLinks?.thumbnail}
      <img
        class="col-span-2 mx-auto"
        src={book.imageLinks.thumbnail}
        alt={book.title}
      />
    {/if}

    <Field label="Title" error={errors?.title}>
      <input type="hidden" name="title" value={book.title} />
      <p class="text-sm text-slate-600/90">{book.title}</p>
    </Field>

    <Field label="URL" error={errors?.url}>
      <input type="hidden" name="url" value={book.infoLink} />
      <a
        href={book.infoLink}
        class="underline block text-sm text-slate-600/90"
        target="_blank"
      >
        Go to url
      </a>
    </Field>

    <Field label="Pages">
      <input type="hidden" name="pages" value={book.pageCount ?? 0} />
      <p class="text-sm text-slate-600/90">{book.pageCount}</p>
    </Field>

    <Field label="Language">
      <input type="hidden" name="language_iso" value={book.language} />
      <p class="text-sm text-slate-600/90">{book.language}</p>
    </Field>

    {#each book.industryIdentifiers as isbn, i (i)}
      {@const isbnName = isbn.type.toLowerCase().replace('_', '')}
      <Field label={isbn.type.replace('_', '-')}>
        <input type="hidden" name={isbnName} value={isbn.identifier} />
        <p class="text-sm text-slate-600/90">{isbn.identifier}</p>
      </Field>
    {/each}

    <Field label="Rating" error={errors?.rating}>
      <input type="hidden" name="rating" value={book.averageRating ?? 0} />
      <p class="text-sm text-slate-600/90 {book.averageRating ? '' : 'italic'}">
        {book.averageRating ?? 'N/A'}
      </p>
    </Field>

    <Field label="Tag">
      {#each book.categories ?? [] as category, i (i)}
        <input type="hidden" name="tags.{i}" value={category} />
      {/each}
      <p class="text-sm text-slate-600/90">{book.categories?.join(', ')}</p>
    </Field>

    <Field label="Authors">
      {#each book.authors as author, i (i)}
        <input type="hidden" name="authors.{i}" value={author} />
      {/each}
      <p class="text-sm text-slate-600/90">{book.authors.join(', ')}</p>
    </Field>

    <Field label="Publisher">
      <input type="hidden" name="publisher" value={book.publisher} />
      <p class="text-sm text-slate-600/90">{book.publisher}</p>
    </Field>

    <input type="hidden" name="thumbnail" value={book.imageLinks?.thumbnail} />
    <input type="hidden" name="read_status" value="unread" />
    <input type="hidden" name="review" />
    <input type="hidden" name="excerpt" />
    <input type="hidden" name="genre_id" />

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
