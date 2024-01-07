<script lang="ts">
  import type { Tag as ITag } from '@/pages/api/tag'

  import AddTag from './_add-tag.svelte'
  import Tag from './_tag.svelte'

  export let tags: ITag[]

  let tagList = [...tags]
  let dialogOpen = false
</script>

<section class="bg-white px-6 py-4 border rounded-md">
  <header class="grid md:grid-cols-[auto_1fr] items-center">
    <h2 class="font-semibold">Tags</h2>

    <aside
      class="grid grid-cols-2 sm:grid-cols-[1fr_auto_auto] gap-2 md:ml-auto mt-2 md:mt-0"
    >
      <form class="relative grow min-w-full md:min-w-72 col-span-2 sm:col-auto">
        <i
          class="icon-[tabler--search] absolute top-1/2 -translate-y-1/2 left-2.5"
        />
        <input
          type="email"
          id="email"
          name="email"
          class="border w-full px-3 py-1.5 rounded-md text-sm
          shadow-sm focus:outline-slate-900 pl-8"
          placeholder="Search..."
        />
      </form>

      <button
        class="flex items-center gap-1 text-sm font-medium
        px-4 py-1.5 border shadow-sm rounded-md
        whitespace-nowrap bg-white hover:bg-slate-50"
      >
        <i class="icon-[tabler--adjustments-alt]" />
        <span>Filters</span>
      </button>

      <button
        on:click={() => (dialogOpen = true)}
        class="flex items-center gap-1 text-sm text-white font-medium
        px-4 py-1.5 border shadow-sm rounded-md
        whitespace-nowrap bg-slate-900 hover:bg-slate-900/90"
      >
        <span>Add tag</span>
      </button>
    </aside>
  </header>

  <ul class="mt-4 overflow-x-auto grid sm:grid-cols-2 md:grid-cols-3 gap-2">
    {#each tagList as tag (tag.id)}
      <Tag
        {tag}
        on:edit={(e) => {
          const tagIdx = tagList.findIndex((o) => o.id === e.detail.id)
          const tag = { ...tagList[tagIdx], ...e.detail }
          tagList[tagIdx] = tag
        }}
        on:delete={(e) => {
          tagList = tagList.filter((o) => o.id !== e.detail)
        }}
      />
    {:else}
      <div
        class="sm:col-span-2 md:col-span-3 grid place-items-center
        p-5 sm:px-10 sm:py-6 md:px-20 md:py-12 text-sm border border-dashed rounded-md"
      >
        <div class="size-16 bg-slate-100 grid place-items-center rounded-full">
          <i class="icon-[tabler--tag] size-10 text-slate-900" />
        </div>

        <hgroup class="text-center my-5 space-y-2.5">
          <h3 class="text-xl font-semibold text-slate-900 tracking-wide">
            No tags created
          </h3>
          <p class="text-slate-500/80">
            You don't have any tags yet. Start creating by uing the below
            button.
          </p>
        </hgroup>

        <button
          on:click={() => (dialogOpen = true)}
          class="flex items-center gap-2 text-sm text-slate-900 font-medium
          px-4 py-1.5 border shadow-sm rounded-md
          whitespace-nowrap bg-white hover:bg-slate-50"
        >
          <i class="icon-[tabler--plus]" />
          <span>Add tag</span>
        </button>
      </div>
    {/each}
  </ul>
</section>

<AddTag bind:dialogOpen on:submit={(e) => (tagList = [...tagList, e.detail])} />
