<script lang="ts">
  import type { Edition } from '@/pages/api/edition'

  import dayjs from 'dayjs'
  import Field from '@/components/field.svelte'
  import FileDropzone from '@/components/file-dropzone.svelte'
  import Date from '../_edition-partials/date.svelte'

  export let purchase_invoice = ''
  export let purchase_price = 0
  export let purchase_date = 0

  export let errors: Record<keyof Edition, string[]> | null = null
</script>

<div class="grid gap-y-4 pb-6 px-6 rounded-md bg-white mt-6">
  <hgroup class="flex items-center justify-between py-4 border-b">
    <h3 class="font-medium">Purchase</h3>
  </hgroup>

  <ul class="space-y-4">
    <div class="grid">
      <span class="text-sm font-medium mb-0.5"> Invoice</span>
      <FileDropzone
        name="purchase_invoice"
        error={errors?.purchase_invoice}
        status={purchase_invoice ? 'resolved' : 'idle'}
        bind:key={purchase_invoice}
      />
    </div>

    <Field label="Price" error={errors?.purchase_price}>
      <input
        type="number"
        name="purchase_price"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={purchase_price}
        class:border-red-500={errors?.purchase_price}
      />
    </Field>

    <Field label="Purchase date" error={errors?.purchase_date}>
      <Date
        name="purchase_date"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900
        {errors?.purchase_date ? 'border-red-500' : ''}"
        value={purchase_date ? dayjs(purchase_date).format('YYYY-MM-DD') : ''}
      />
    </Field>
  </ul>
</div>
