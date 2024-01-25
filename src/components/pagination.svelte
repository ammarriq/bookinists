<script lang="ts">
  import { Pagination } from 'bits-ui'

  export let count: number
  export let perPage: number
  export let currentPage: number

  $: isPrev = currentPage <= 1
  $: isNext = currentPage >= Math.ceil(count / perPage)
</script>

<Pagination.Root {count} {perPage} page={currentPage} let:pages>
  <div class="flex gap-1 items-center justify-center text-sm">
    <Pagination.PrevButton asChild let:builder>
      <a
        {...builder}
        href="?page={isPrev ? currentPage : currentPage - 1}"
        class="btn hover:bg-slate-100"
        class:opacity-30={isPrev}
        on:click={(e) => isPrev && e.preventDefault()}
      >
        <i class="icon-[tabler--chevron-left]" />
      </a>
    </Pagination.PrevButton>

    <div class="flex items-center gap-1">
      {#each pages as page (page.key)}
        {#if page.type === 'ellipsis'}
          <span class="size-6 grid place-items-center">...</span>
        {:else}
          {@const isCurrentPage = currentPage === page.value}
          <Pagination.Page {page} asChild let:builder>
            <a
              {...builder}
              href="?page={page.value}"
              class="btn data-[selected]:bg-slate-900 data-[selected]:text-white"
              class:hover:bg-slate-100={!isCurrentPage}
              on:click={(e) => isCurrentPage && e.preventDefault()}
            >
              {page.value}
            </a>
          </Pagination.Page>
        {/if}
      {/each}
    </div>

    <Pagination.NextButton asChild let:builder>
      <a
        {...builder}
        href="?page={isNext ? currentPage : currentPage + 1}"
        class="btn hover:bg-slate-100"
        class:opacity-30={isNext}
        on:click={(e) => isNext && e.preventDefault()}
      >
        <i class="icon-[tabler--chevron-right]" />
      </a>
    </Pagination.NextButton>
  </div>
</Pagination.Root>

<style lang="postcss">
  .btn {
    @apply size-8 grid place-items-center rounded-md;
  }
</style>
