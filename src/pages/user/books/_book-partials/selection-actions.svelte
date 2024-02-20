<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements'
  import type { Book } from '@/pages/api/book'

  import { fade, fly } from 'svelte/transition'
  import { DropdownMenu as Dropdown, Dialog, Combobox } from 'bits-ui'
  import { clickParent } from '@/lib/actions'
  import { debounce } from '@/lib/utils'
  import Field from '@/components/field.svelte'
  import Button from '@/components/button.svelte'

  export let books: string[]

  let submitting = false
  let dialogOpen = false

  let moveTo = ''
  let items: Record<'value' | 'label', string>[] = []
  let errors: Record<keyof Book, string[]> | null = null

  const editBook: FormEventHandler<HTMLFormElement> = async (e) => {
    submitting = true

    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch(form.action, {
      method: form.method,
      body: formData,
    })

    submitting = false
    const json = (await res.json()) as FetchResponse<Book>
    if (!json.success) return (errors = json.errors)

    books = []
    dialogOpen = false
  }

  const debouncedFetch = debounce(async (value: string) => {
    const res = await fetch(`/api/${moveTo}?query=${value}`)
    const json = (await res.json()) as FetchResponse<typeof items>
    submitting = false

    items = json.data ?? []
  }, 500)

  const onInput = (e: unknown) => {
    const event = (e as CustomEvent<Event>).detail
    const target = event.currentTarget as HTMLInputElement
    if (!target.value) return

    submitting = true
    debouncedFetch(target.value)
  }
</script>

<Dropdown.Root>
  <Dropdown.Trigger asChild let:builder>
    <Button use={builder.action} {...builder} class="py-1.5 px-2">
      <i class="icon-[tabler--send] size-4" />
    </Button>
  </Dropdown.Trigger>

  <Dropdown.Content
    transition={(e) => fly(e, { duration: 150, y: 10 })}
    align="end"
    class="rounded-md w-36 text-sm bg-white shadow mt-1"
  >
    <Dropdown.Label class="px-3 py-1.5 capitalize font-semibold">
      Add to
    </Dropdown.Label>
    <Dropdown.Separator class="bg-slate-100 h-px" />
    <Dropdown.Group class="p-1">
      <Dropdown.Item
        class="text-left w-full px-3 py-1.5 rounded-md hover:bg-slate-100"
        on:click={() => {
          dialogOpen = true
          moveTo = 'list'
        }}
      >
        List
      </Dropdown.Item>
      <Dropdown.Item
        class="text-left w-full px-3 py-1.5 rounded-md hover:bg-slate-100"
        on:click={() => {
          dialogOpen = true
          moveTo = 'tag'
        }}
      >
        Tag
      </Dropdown.Item>
      <Dropdown.Item
        class="text-left w-full px-3 py-1.5 rounded-md hover:bg-slate-100"
        on:click={() => {
          dialogOpen = true
          moveTo = 'genre'
        }}
      >
        Genre
      </Dropdown.Item>
      <Dropdown.Item
        class="text-left w-full px-3 py-1.5 rounded-md hover:bg-slate-100"
        on:click={() => {
          dialogOpen = true
          moveTo = 'collection'
        }}
      >
        Collection
      </Dropdown.Item>
    </Dropdown.Group>
  </Dropdown.Content>
</Dropdown.Root>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Portal>
    <Dialog.Overlay
      transition={(node) => fade(node, { duration: 150 })}
      class="fixed inset-0 bg-black/60 z-50"
    />

    <Dialog.Content
      class="dialog fixed inset-0 grid place-items-center
      py-12 overflow-y-auto bg-transparent z-50"
    >
      <div
        transition:fly={{ y: '10px', duration: 150 }}
        class="relative py-5 px-6 border rounded-md bg-white
        w-[calc(100%-2rem)] max-w-md outline-none"
        use:clickParent={() => (dialogOpen = false)}
      >
        <button
          class="icon-[tabler--x] absolute top-4 right-4"
          on:click={() => (dialogOpen = false)}
        />

        <Dialog.Title class="space-y-1 mb-4">
          <h2 class="text-base font-semibold">Move Books</h2>
        </Dialog.Title>

        <form
          action="/api/book?move_to_{moveTo}"
          method="post"
          class="space-y-4"
          on:submit|preventDefault={editBook}
        >
          {#each books as book (book)}
            <input type="hidden" name="book_ids" value={book} />
          {/each}

          <Field label="Select {moveTo}" error={errors?.read_status}>
            <Combobox.Root portal=".dialog">
              <Combobox.HiddenInput name="{moveTo}_id" />
              <Combobox.Input
                on:input={onInput}
                type="text"
                class="border w-full px-3 py-1.5 rounded-md text-sm
                shadow-sm focus:outline-slate-900"
              />

              <Combobox.Content
                class="w-full rounded-md p-1 border bg-white shadow-sm z-40"
                transition={(e) => fly(e, { duration: 150, y: -5 })}
                sideOffset={8}
              >
                {#each items as { value, label } (value)}
                  <Combobox.Item
                    class="px-2 py-1 text-sm capitalize rounded-md cursor-default hover:bg-slate-100"
                    {value}
                    {label}
                  >
                    {label}
                  </Combobox.Item>
                {:else}
                  <p class="flex justify-center p-1">
                    {#if submitting}
                      <i class="icon-[tabler--loader-2] animate-spin" />
                    {:else}
                      <span class="text-sm italic text-gray-600">
                        Please type to search something
                      </span>
                    {/if}
                  </p>
                {/each}
              </Combobox.Content>
            </Combobox.Root>
          </Field>

          <button
            class="flex items-center justify-center text-sm text-white font-medium
            px-4 py-1.5 rounded-md ml-auto mt-4 bg-slate-900
            hover:bg-slate-900/90 disabled:bg-slate-900/50"
            disabled={submitting}
          >
            {#if submitting}
              <i class="icon-[tabler--loader-2] shrink-0 animate-spin mr-1.5" />
            {/if}
            Submit
          </button>
        </form>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
