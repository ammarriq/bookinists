<script lang="ts">
  import type { Edition } from '@/pages/api/edition'

  import Field from '@/components/field.svelte'

  export let width = 0
  export let height = 0
  export let depth = 0

  export let errors: Record<keyof Edition, string[]> | null = null
</script>

<div class="grid gap-y-4 pb-6 px-6 rounded-md bg-white mt-6">
  <h3 class="font-medium py-4 border-b">Dimension</h3>

  <aside class="grid md:grid-cols-2 gap-4">
    <Field label="Width" error={errors?.width}>
      <input
        type="number"
        name="width"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={width}
      />
    </Field>

    <Field label="Height" error={errors?.height}>
      <input
        type="number"
        name="height"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
        value={height}
      />
    </Field>

    <Field label="Depth" error={errors?.depth}>
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
