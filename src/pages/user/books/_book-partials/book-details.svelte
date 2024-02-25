<script lang="ts">
  import type { Book } from '@/pages/api/book/index'

  import { stars } from '@/lib/utils'

  export let books: (Book & { author_name: string })[]
</script>

<section class="p-6 rounded-md bg-white">
  <div class="text-gray-500 text-sm">
    <h2 class="text-gray-700 font-bold text-xl">{books[0].title}</h2>

    {#if books[0].author_name}
      <p class="mt-2">By {books.map((o) => o.author_name).join(', ')}</p>
    {/if}

    <div class="flex items-center gap-1 my-3">
      {#each stars(books[0].rating ?? 0) as star, i (i)}
        <i
          class="text-orange-500 size-4"
          class:icon-[tabler--star-filled]={star === 'full'}
          class:icon-[tabler--star-half-filled]={star === 'half'}
          class:icon-[tabler--star]={star === 'empty'}
        />
      {/each}
    </div>

    {#if books[0].excerpt}
      <p class="max-w-md">
        {books[0].excerpt}
      </p>
    {/if}

    <a
      href={books[0].url}
      target="_blank"
      class="mt-4 max-w-max flex items-center gap-1 text-sm text-white
      font-medium px-4 py-1.5 border shadow-sm rounded-md
      whitespace-nowrap bg-slate-900 hover:bg-slate-900/90"
    >
      More
    </a>
  </div>
</section>
