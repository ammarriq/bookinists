<script lang="ts">
  let clazz = ''
  export { clazz as class }
  export let label: string
  export let error: string[] = []
</script>

<label class="block space-y-0.5 {clazz}">
  <span class="text-sm font-medium"> {label} </span>
  <div class="relative w-full grid">
    {#if !!error}
      <small class="text-sm absolute top-full left-0 text-red-500">
        {error}
      </small>
    {/if}

    <slot />
  </div>
</label>
