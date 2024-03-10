<script lang="ts">
  import type { Marketplace } from '@/pages/api/contact-marketplace'

  import MarketplaceActions from './marketplace-actions.svelte'

  export let marketplace: Marketplace
</script>

<li class="text-sm bg-slate-100 rounded-md px-5 py-4 space-y-4">
  <header class="flex items-center justify-between">
    <p class="font-semibold text-slate-900">{marketplace.name ?? ''}</p>

    <div class="flex items-center">
      <MarketplaceActions {marketplace} on:delete on:edit />
    </div>
  </header>

  <p class="text-slate-500 leading-relaxed pr-1 line-clamp-3">
    {marketplace.description}
  </p>
</li>
