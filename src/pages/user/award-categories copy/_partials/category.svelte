<script lang="ts">
  import type { AwardCategory as Category } from '@/pages/api/award-category'

  import CategoryActions from './category-actions.svelte'

  export let category: Category
</script>

<li class="text-sm bg-slate-100 rounded-md px-5 py-4 space-y-4">
  <header class="flex items-center justify-between">
    <p class="font-semibold text-slate-900">{category.name}</p>
    <CategoryActions {category} on:delete on:edit />
  </header>

  <p class="text-slate-500 leading-relaxed pr-1 line-clamp-3">
    {category.description}
  </p>
</li>
