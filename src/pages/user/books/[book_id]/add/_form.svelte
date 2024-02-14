<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { Edition } from '@/pages/api/edition'

  import { navigate } from 'astro:transitions/client'
  import Condition from '../../_edition-partials/condition.svelte'
  import Dimensions from '../../_edition-partials/dimensions.svelte'
  import General from '../../_edition-partials/general.svelte'
  import Management from '../../_edition-partials/management.svelte'
  import Price from '../../_edition-partials/price.svelte'
  import Printing from '../../_edition-partials/printing.svelte'
  import Signature from '../../_edition-partials/signature.svelte'

  import Purchase from '../../_thumbnail-partials/purchase.svelte'
  import Thumbnails from '../../_thumbnail-partials/thumbnails.svelte'

  export let book_id: string
  export let book_title: string

  let submitting = false
  let errors: Record<keyof Edition, string[]> | null = null

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

    navigate(`/user/books/${book_id}`)
  }
</script>

<form
  action="/api/edition?add"
  method="post"
  class="px-4 py-6 grid md:grid-cols-[minmax(0,1fr)_300px] gap-6"
  on:submit|preventDefault={submit}
>
  <input type="hidden" name="book_id" value={book_id} />
  <input type="hidden" name="publisher_id" />
  <header
    class="md:col-span-2 px-6 py-4 rounded-md
    flex items-center justify-between bg-white"
  >
    <h2 class="font-semibold">{book_title}</h2>

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
  </header>

  <section>
    <General {errors} />
    <Management {errors} />
    <Printing {errors} />
    <Signature {errors} />
    <Condition {errors} />
    <Dimensions {errors} />
    <Price {errors} />
  </section>

  <aside>
    <Thumbnails {errors} />
    <Purchase {errors} />
  </aside>
</form>
