<script lang="ts">
  import type { HTMLImgAttributes } from 'svelte/elements'
  import Url from './url.svelte'

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

<Url key={src ?? ''} let:url>
  <slot slot="fallback" name="fallback" />
  <img {...$$restProps} src={url} {alt} />
  <slot slot="catch" name="catch" />
</Url>
