<script lang="ts">
  let clazz = ''

  export { clazz as class }
  export let label = ''
  export let error: string[] = []
</script>

<label class="grid {clazz}">
  {#if label}
    <span class="text-sm font-medium mb-0.5"> {label} </span>
  {/if}

  <div class="relative w-full grid">
    {#if !!error}
      <small class="text-sm absolute top-full left-0 text-red-500">
        {error}
      </small>
    {/if}

    <slot />
  </div>
</label>
