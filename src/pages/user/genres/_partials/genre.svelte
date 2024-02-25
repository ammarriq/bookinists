<script lang="ts">
  import type { Genre } from '@/pages/api/genre/index'

  import GenreActions from './genre-actions.svelte'
  export let genre: Genre
</script>

<li class="relative text-sm bg-slate-100 rounded-md px-5 py-4">
  <div class="absolute top-4 right-5 z-20">
    <GenreActions {genre} on:delete on:edit />
  </div>

  <div class="space-y-2">
    <p class="font-semibold text-slate-900">{genre.name ?? ''}</p>
    <p class="text-slate-500 leading-relaxed pr-1 line-clamp-3">
      {genre.description}
    </p>
  </div>
</li>
