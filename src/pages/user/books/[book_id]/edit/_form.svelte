<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { Edition, Thumbnail } from '@/pages/api/edition'

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

  export let edition: Edition & { book_title: string }
  export let thumbnails: Thumbnail[]

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

    navigate(`/user/books/${edition.book_id}`)
  }
</script>

<form
  action="/api/edition?edit"
  method="post"
  class="px-4 py-6 grid md:grid-cols-[minmax(0,1fr)_300px] gap-6"
  on:submit|preventDefault={submit}
>
  <input type="hidden" name="id" value={edition.id} />
  <input type="hidden" name="book_id" value={edition.book_id} />
  <input type="hidden" name="publisher_id" />
  <header
    class="md:col-span-2 px-6 py-4 rounded-md
    flex items-center justify-between bg-white"
  >
    <h2 class="font-semibold">{edition.book_title}</h2>

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
    <General
      date={edition.date}
      isbn={edition.isbn}
      isbn13={edition.isbn13}
      msrp={edition.msrp}
      pages={edition.pages}
      description={edition.description}
      {errors}
    />

    <Management
      status={edition.status}
      protection={edition.protection}
      binding={edition.binding}
      {errors}
    />

    <Printing
      is_limited={!!edition.is_limited}
      limited_num={edition.limited_num}
      limited_total={edition.limited_total}
      edition={edition.edition}
      total_printed={edition.total_printed}
      printing={edition.printing}
      {errors}
    />

    <Signature
      is_signed={!!edition.is_signed}
      signature_type={edition.signature_type}
      signature_page={edition.signature_page}
      {errors}
    />

    <Condition
      need_repair={!!edition.need_repair}
      book_condition={edition.book_condition}
      book_condition_notes={edition.book_condition_notes}
      jacket_condition={edition.jacket_condition}
      jacket_condition_notes={edition.jacket_condition_notes}
      {errors}
    />

    <Dimensions
      width={edition.width}
      height={edition.height}
      depth={edition.depth}
      {errors}
    />

    <Price
      buyer_id={edition.buyer_id ?? ''}
      seller_id={edition.seller_id ?? ''}
      sell_price={edition.sell_price}
      sell_date={edition.sell_date}
      lender_id={edition.lender_id ?? ''}
      lend_status={edition.lend_status}
      lend_date={edition.lending_time}
      {errors}
    />
  </section>

  <aside>
    <Thumbnails {thumbnails} {errors} />

    <Purchase
      purchase_date={edition.purchase_date}
      purchase_price={edition.purchase_price}
      purchase_invoice={edition.purchase_invoice}
      {errors}
    />
  </aside>
</form>
