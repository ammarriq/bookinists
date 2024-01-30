<script lang="ts">
  import dayjs from 'dayjs'
  import Field from '@/components/field.svelte'

  export let date = new Date().getTime()
  export let isbn = ''
  export let isbn13 = ''
  export let msrp = 0
  export let pages = 0
  export let description = ''
</script>

<div class="grid gap-y-4 border-b pb-6 mt-6">
  <hgroup>
    <h3 class="font-semibold tracking-wider">General</h3>
    <p class="text-slate-500/70 text-xs mt-1">
      General information related to the edition
    </p>
  </hgroup>

  <aside class="grid md:grid-cols-2 gap-3">
    <Field label="Date" class="md:col-span-2">
      <input
        type="date"
        name="isbn"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        disabled
        value={dayjs(date).format('YYYY-MM-DD')}
      />
    </Field>

    <Field label="ISBN 10">
      <input
        type="text"
        name="isbn"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={isbn}
      />
    </Field>

    <Field label="ISBN 13">
      <input
        type="text"
        name="isbn13"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={isbn13}
      />
    </Field>

    <Field label="MSRP">
      <input
        type="text"
        name="msrp"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={msrp}
      />
    </Field>

    <Field label="Total pages">
      <input
        type="text"
        name="pages"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={pages}
      />
    </Field>

    <Field label="Description" class="md:col-span-2">
      <textarea
        name="description"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900 h-24"
        value={description ?? ''}
      ></textarea>
    </Field>
  </aside>
</div>
