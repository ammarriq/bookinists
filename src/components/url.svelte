<script lang="ts">
  export let key = ''

  const load = async (key: string) => {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.src = key

      image.onload = resolve
      image.onerror = reject
    })
  }
</script>

{#await load(key ?? '')}
  <slot name="fallback" />
{:then url}
  <slot {url} />
{:catch}
  <slot name="catch" />
{/await}
