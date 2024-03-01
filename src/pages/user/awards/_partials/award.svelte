<script lang="ts">
  import type { Award } from '@/pages/api/award'

  import Image from '@/components/image.svelte'
  import AwardActions from './award-actions.svelte'

  export let award: Award
</script>

<li class="text-sm bg-slate-100 rounded-md px-5 py-4 space-y-4">
  <header class="flex items-center justify-between">
    <div class="flex gap-2 items-center min-w-max">
      <Image
        class="flex size-7 items-center justify-center rounded-full"
        src={award.image}
        alt={award.name}
      >
        <div
          slot="fallback"
          class="flex items-center justify-center
          bg-red-600 rounded-full size-7"
        >
          <i class="icon-[tabler--user] size-5 text-white" />
        </div>
      </Image>

      <p class="font-semibold text-slate-900">{award.name ?? ''}</p>
    </div>

    <div class="flex items-center">
      <AwardActions {award} on:delete on:edit />
    </div>
  </header>

  <p class="text-slate-500 leading-relaxed pr-1 line-clamp-3">
    {award.description}
  </p>
</li>
