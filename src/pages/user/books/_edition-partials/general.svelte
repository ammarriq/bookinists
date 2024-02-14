<script lang="ts">
  import type { Edition } from '@/pages/api/edition'

  import dayjs from 'dayjs'
  import Field from '@/components/field.svelte'
  import CountrySelect from '../../_country-select.svelte'
  import Date from './date.svelte'

  export let date = 0
  export let isbn = ''
  export let isbn13 = ''
  export let msrp = 0
  export let pages = 0
  export let language_iso = ''
  export let country_id = ''
  export let description = ''

  export let errors: Record<keyof Edition, string[]> | null = null
</script>

<div class="grid gap-y-4 pb-6 px-6 rounded-md bg-white">
  <h3 class="font-medium py-4 border-b">General</h3>

  <aside class="grid md:grid-cols-2 gap-4">
    <Field label="Date" class="md:col-span-2" error={errors?.date}>
      <Date
        name="date"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900
        {errors?.date ? 'border-red-500' : ''}"
        value={date ? dayjs(date).format('YYYY-MM-DD') : ''}
      />
    </Field>

    <Field label="ISBN 10" error={errors?.isbn}>
      <input
        type="text"
        name="isbn"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={isbn}
        class:border-red-500={errors?.isbn}
      />
    </Field>

    <Field label="ISBN 13" error={errors?.isbn13}>
      <input
        type="text"
        name="isbn13"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={isbn13}
        class:border-red-500={errors?.isbn13}
      />
    </Field>

    <Field label="MSRP" error={errors?.msrp}>
      <input
        type="text"
        name="msrp"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={msrp}
        class:border-red-500={errors?.msrp}
      />
    </Field>

    <Field label="Total pages" error={errors?.pages}>
      <input
        type="number"
        name="pages"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={pages}
        class:border-red-500={errors?.pages}
      />
    </Field>

    <Field label="Language" error={errors?.language_iso}>
      <input
        type="text"
        name="language_iso"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={language_iso}
        class:border-red-500={errors?.language_iso}
      />
    </Field>

    <Field label="Country" error={errors?.country_id}>
      <CountrySelect {country_id} />
    </Field>

    <Field
      label="Description"
      class="md:col-span-2"
      error={errors?.description}
    >
      <textarea
        name="description"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900 h-24"
        value={description ?? ''}
        class:border-red-500={errors?.description}
      />
    </Field>
  </aside>
</div>
