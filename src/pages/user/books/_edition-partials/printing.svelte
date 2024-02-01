<script lang="ts">
  import { Switch } from 'bits-ui'
  import Field from '@/components/field.svelte'

  export let is_limited = false
  export let limited_num = 0
  export let limited_total = 0
  export let edition = 0
  export let total_printed = 0
  export let printing = 0
</script>

<div class="grid gap-y-4 pb-6 px-6 rounded-md bg-white mt-6">
  <h3 class="font-medium py-4 border-b">Printing</h3>

  <aside class="grid md:grid-cols-2 gap-3">
    <Field class="col-span-2 px-3 py-2 border rounded-md">
      <div class="flex items-center justify-between">
        <hgroup>
          <h2 class="text-sm font-medium">Limited</h2>
          <p class="text-sm text-slate-500/70">Is the edition limited?</p>
        </hgroup>

        <Switch.Root
          checked={is_limited}
          class="flex items-center w-[40px] h-[21px]
          rounded-full bg-slate-200 data-[checked]:bg-slate-900"
        >
          <Switch.Input class="peer" name="is_limited" />
          <i
            class="bg-white rounded-full duration-300 size-[17px]
            translate-x-[2px] peer-checked:translate-x-[20px]"
          />
        </Switch.Root>
      </div>
    </Field>

    <Field label="Limited number">
      <input
        type="number"
        name="limited_num"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={limited_num}
      />
    </Field>

    <Field label="Limited total">
      <input
        type="number"
        name="limited_total"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={limited_total}
      />
    </Field>

    <Field label="Edition">
      <input
        type="number"
        name="edition"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={edition}
      />
    </Field>

    <Field label="Total printed">
      <input
        type="number"
        name="total_printed"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={total_printed}
      />
    </Field>

    <Field label="Printing">
      <input
        type="number"
        name="printing"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={printing}
      />
    </Field>
  </aside>
</div>
