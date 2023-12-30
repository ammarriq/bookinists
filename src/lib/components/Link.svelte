<script lang="ts">
  type $$Props = {
    isActive: (href: string) => boolean
    href: string
  }

  export let isActive: $$Props['isActive']
  export let href: $$Props['href']
</script>

<a
  {href}
  class={`flex items-center gap-2 py-2.5 px-3.5 rounded-md
  ${
    isActive(href)
      ? 'text-white bg-violet-600'
      : 'text-gray-500/80 hover:bg-gray-100'
  }`}
>
  <slot />
</a>
