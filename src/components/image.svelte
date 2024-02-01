<script lang="ts">
  import type { HTMLImgAttributes } from 'svelte/elements'

  type $$Props = HTMLImgAttributes
  export let src: $$Props['src'] = ''
  export let alt: $$Props['alt'] = ''

  const getFile = async (key: string) => {
    const res = await fetch(`/api/file?key=${key}`)

    const blob = new Blob([await res.arrayBuffer()])
    const url = URL.createObjectURL(blob)

    await loadImg(url)

    return url
  }

  const loadImg = async (src: string) => {
    return new Promise((r) => {
      const image = new Image()
      image.src = src

      image.onload = r
    })
  }
</script>

{#if import.meta.env.PROD}
  {#await loadImg(`${import.meta.env.PUBLIC_R2_BUCKET_URL}`)}
    <slot name="fallback" />
  {:then}
    <img {...$$restProps} {src} {alt} />
  {/await}
{/if}

{#if import.meta.env.DEV}
  {#await getFile(src ?? '')}
    <slot name="fallback" />
  {:then url}
    <img {...$$restProps} src={url} {alt} />
  {/await}
{/if}
