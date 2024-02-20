<script lang="ts">
  import type { HTMLImgAttributes } from 'svelte/elements'

  type $$Props = HTMLImgAttributes
  export let src: $$Props['src'] = ''
  export let alt: $$Props['alt'] = ''

  const getUrl = (key: string) => {
    return `${import.meta.env.PUBLIC_BASE_URL}/api/file?key=${key}`
  }

  const loadImg = async () => {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.src = getUrl(src ?? '')

      image.onload = resolve
      image.onerror = reject
    })
  }
</script>

{#await loadImg()}
  <slot name="fallback" />
{:then _}
  <img {...$$restProps} src={getUrl(src ?? '')} {alt} />
{:catch}
  <slot name="catch" />
{/await}
