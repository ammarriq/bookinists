<script lang="ts">
  import type { SelectItem } from '@/lib/types'

  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'
  import { Select } from 'bits-ui'
  import { debounce } from '@/lib/utils'

  export let book_id = ''

  let initialLoad = true
  let fetching = false
  let inputValue = ''

  let allItems: SelectItem[] = []
  let oldItems: (SelectItem & { remove: boolean; book_author: string })[] = []
  let newItems: SelectItem[] = []

  onMount(async () => {
    const res = await fetch(`/api/book/authors?book_id=${book_id}`)
    const { data } = (await res.json()) as FetchResponse<typeof oldItems>
    initialLoad = false

    oldItems = data?.map((o) => ({ ...o, remove: false })) ?? []
  })

  const debouncedFetch = debounce(async (value: string) => {
    const res = await fetch(`/api/author/search?query=${value}`)
    const json = (await res.json()) as FetchResponse<typeof allItems>
    fetching = false

    allItems = json.data ?? []
  }, 500)

  const onInput = (event: Event) => {
    const target = event.currentTarget as HTMLInputElement
    if (!target.value) return

    fetching = true
    debouncedFetch(target.value)
  }
</script>

{#if initialLoad}
  <div class="grid place-items-center">
    <i class="icon-[tabler--loader-2] animate-spin" />
  </div>
{:else}
  <div
    class="flex flex-wrap gap-1"
    class:mb-2={newItems.length || oldItems.length}
  >
    {#each oldItems as { book_author, value, label, remove } (value)}
      {@const name = remove ? 'remove_authors' : undefined}
      <input type="hidden" {name} value={book_author} />
      <aside
        class="flex items-center gap-2 px-2 rounded bg-gray-100"
        class:hidden={remove}
      >
        <p class="py-0.5 text-sm">{label}</p>

        <button
          type="button"
          class="icon-[tabler--x] size-3"
          on:click={() => {
            oldItems = oldItems.map((o) => {
              if (o.value !== value) return o
              return { ...o, remove: true }
            })
          }}
        />
      </aside>
    {/each}

    {#each newItems as { value, label } (value)}
      <input type="hidden" name="add_authors" {value} />
      <aside class="flex items-center gap-2 px-2 rounded bg-gray-100">
        <p class="py-0.5 text-sm">{label}</p>

        <button
          type="button"
          class="icon-[tabler--x] size-3"
          on:click={() => {
            newItems = newItems.map((o) => {
              if (o.value !== value) return o
              return { ...o, removed: true }
            })
          }}
        />
      </aside>
    {/each}
  </div>

  <Select.Root
    multiple
    portal=".author-dialog"
    onSelectedChange={(e) => {
      inputValue = ''

      newItems = (e ?? [])
        .filter((i) => !oldItems.some((o) => o.value === i.value))
        .map((o) => ({
          value: String(o.value),
          label: String(o.label),
        }))

      oldItems = oldItems.map((o) => ({
        ...o,
        remove: e?.some((i) => i.value === o.value) ? false : o.remove,
      }))
    }}
  >
    <Select.Trigger asChild let:builder>
      <input
        {...builder}
        use:builder.action
        on:input={onInput}
        bind:value={inputValue}
        type="text"
        class="border w-full px-3 py-1.5 rounded-md text-sm
        shadow-sm focus:outline-slate-900"
      />
    </Select.Trigger>
    <Select.Content
      class="w-full rounded-md p-1 border bg-white shadow-sm z-40"
      transition={(e) => fly(e, { duration: 150, y: -5 })}
      sideOffset={8}
    >
      {#each allItems as { value, label } (value)}
        {@const isOld = oldItems.find((o) => o.value === value)}
        {@const isNew = newItems.some((o) => o.value === value)}
        {@const isSelected = isNew || isOld?.remove === false}

        <Select.Item
          class="px-2 py-1 text-sm capitalize rounded-md flex items-center
          cursor-default hover:bg-slate-100 data-[disabled]:hover:bg-transparent"
          disabled={isSelected}
          {value}
          {label}
        >
          {label}
          {#if isSelected}
            <i class="icon-[tabler--check] ml-auto" />
          {/if}
        </Select.Item>
      {:else}
        <p class="flex justify-center p-1">
          {#if fetching}
            <i class="icon-[tabler--loader-2] animate-spin" />
          {:else}
            <span class="text-sm italic text-gray-600">
              Please type to search something
            </span>
          {/if}
        </p>
      {/each}
    </Select.Content>
  </Select.Root>
{/if}
