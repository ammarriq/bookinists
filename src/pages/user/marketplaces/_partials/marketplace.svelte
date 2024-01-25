<script lang="ts">
  import type { Marketplace } from '@/pages/api/marketplace'

  import { Avatar } from 'bits-ui'
  import MarketplaceActions from './marketplace-actions.svelte'

  export let marketplace: Marketplace

  let image = ''

  const getFile = async (key: string) => {
    const res = await fetch(`/api/file?key=${key}`)

    const blob = new Blob([await res.arrayBuffer()])
    const url = URL.createObjectURL(blob)

    image = url
  }

  $: if (typeof window !== 'undefined') {
    getFile(marketplace.icon)
  }
</script>

<li class="text-sm bg-slate-100 rounded-md px-5 py-4 space-y-4">
  <header class="flex items-center justify-between">
    <div class="flex gap-2 items-center min-w-max">
      <Avatar.Root class="flex size-7 items-center justify-center rounded-full">
        <Avatar.Image src={image} alt={marketplace.name} />
        <Avatar.Fallback
          class="flex items-center justify-center
          bg-red-600 rounded-full size-7"
        >
          <i class="icon-[tabler--user] size-5 text-white" />
        </Avatar.Fallback>
      </Avatar.Root>

      <p class="font-semibold text-slate-900">{marketplace.name ?? ''}</p>
    </div>

    <div class="flex items-center">
      <MarketplaceActions {marketplace} on:delete on:edit />
    </div>
  </header>

  <p class="text-slate-500 leading-relaxed pr-1 line-clamp-3">
    {marketplace.description}
  </p>
</li>
