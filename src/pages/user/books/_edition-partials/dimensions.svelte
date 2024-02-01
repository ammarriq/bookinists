<script lang="ts">
  import Field from '@/components/field.svelte'

  export let width = 0
  export let height = 0
  export let depth = 0
</script>

<div class="grid gap-y-4 pb-6 px-6 rounded-md bg-white mt-6">
  <h3 class="font-medium py-4 border-b">Dimension</h3>

  <aside class="grid md:grid-cols-2 gap-3">
    <Field label="Width">
      <input
        type="number"
        name="width"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={width}
      />
    </Field>

    <Field label="Height">
      <input
        type="number"
        name="height"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={height}
      />
    </Field>

    <Field label="Depth">
      <input
        type="number"
        name="depth"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={depth}
      />
    </Field>
  </aside>
</div>
