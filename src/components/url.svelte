<script lang="ts">
  export let key = ''

  const getFile = async (key: string) => {
    const res = await fetch(`/api/file?key=${key}`)

    const blob = new Blob([await res.arrayBuffer()])
    const url = URL.createObjectURL(blob)

    await loadImg(url)

    return url
  }

  const loadImg = async (key: string) => {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.src = key

      image.onload = resolve
      image.onerror = reject
    })
  }
</script>

{#if import.meta.env.PROD}
  {@const url = `${import.meta.env.PUBLIC_R2_BUCKET_URL}/${key}`}
  {#await loadImg(url)}
    <slot name="fallback" />
  {:then}
    <slot {url} />
  {:catch}
    <slot name="catch" />
  {/await}
{/if}

{#if import.meta.env.DEV}
  {#await getFile(key ?? '')}
    <slot name="fallback" />
  {:then url}
    <slot {url} />
  {:catch}
    <slot name="catch" />
  {/await}
{/if}
