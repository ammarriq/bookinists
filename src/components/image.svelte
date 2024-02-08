<script lang="ts">
  import type { HTMLImgAttributes } from 'svelte/elements'
  import Url from './url.svelte'

  type $$Props = HTMLImgAttributes
  export let src: $$Props['src'] = ''
  export let alt: $$Props['alt'] = ''
</script>

<Url key={src ?? ''} let:url>
  <slot slot="fallback" name="fallback" />
  <img {...$$restProps} src={url} {alt} />
  <slot slot="catch" name="catch" />
</Url>
