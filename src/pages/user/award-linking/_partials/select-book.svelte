<script lang="ts">
  import type { SelectItem } from '@/lib/types'

  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'
  import { Combobox } from 'bits-ui'
  import { debounce } from '@/lib/utils'

  export let book_id: string | null = null

  let initialLoad = true
  let fetching = false
  let defaultSelected: SelectItem
  let allItems: SelectItem[] = []

  onMount(async () => {
    if (!book_id) {
      initialLoad = false
      return
    }

    const res = await fetch(`/api/book/${book_id}`)
    const { data } = (await res.json()) as FetchResponse<SelectItem>

    initialLoad = false
    if (!data) return

    defaultSelected = data
    allItems = [data]
  })

  const debouncedFetch = debounce(async (value: string) => {
    const res = await fetch(`/api/book/search?query=${value}`)
    const json = (await res.json()) as FetchResponse<typeof allItems>

    fetching = false
    allItems = json.data ?? []
  }, 500)

  const onInput = (e: unknown) => {
    const event = (e as CustomEvent<Event>).detail
    const target = event.currentTarget as HTMLInputElement
    if (!target.value) return

    fetching = true
    debouncedFetch(target.value)
  }
</script>

{#if initialLoad}
  <div
    class="flex items-center justify-between border w-full px-3
    py-1.5 rounded-md text-sm shadow-sm focus:outline-slate-900"
    aria-label="Select a book"
  >
    <p class="text-sm flex items-center gap-2">
      <i class="icon-[tabler--loader-2] animate-spin duration-300" />
      <span class="italic capitalize">fetching...</span>
    </p>
  </div>
{:else}
  <Combobox.Root portal=".dialog" selected={defaultSelected}>
    <Combobox.HiddenInput name="book_id" />
    <Combobox.Input
      type="text"
      class="border w-full px-3 py-1.5 rounded-md text-sm
      shadow-sm focus:outline-slate-900"
      on:input={(e) => onInput(e)}
    />

    <Combobox.Content
      class="w-full rounded-md p-1 border bg-white shadow-sm z-40"
      transition={(e) => fly(e, { duration: 150, y: -5 })}
      sideOffset={8}
    >
      {#if fetching}
        <p class="text-sm grid place-items-center gap-2 py-1">
          <i class="icon-[tabler--loader-2] animate-spin duration-300" />
        </p>
      {:else}
        {#each allItems as book (book.value)}
          <Combobox.Item
            class="px-2 py-1 text-sm capitalize rounded-md
            cursor-default hover:bg-slate-100"
            value={book.value}
            label={book.label}
          >
            {book.label}
          </Combobox.Item>
        {:else}
          <p class="text-xs text-center py-1">
            <span class="italic capitalize text-slate-500">Type to search</span>
          </p>
        {/each}
      {/if}
    </Combobox.Content>
  </Combobox.Root>
{/if}
